#!/usr/bin/env python3
"""
scripts/serve.py — Zero-dependency local dev server for ln-ashlar demos.

Serves all static assets (HTML, CSS, JS, fonts, SVGs) from project root,
and transparently emulates `api.php` endpoints (e.g. table-sync.html, list.html)
using `demo/admin/data/documents.json`.

Usage:
    python3 scripts/serve.py [PORT]
"""

import http.server
import socketserver
import urllib.parse
import json
import os
import sys
import datetime

DEFAULT_PORT = 8000
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DOCUMENTS_JSON = os.path.join(ROOT_DIR, "demo", "admin", "data", "documents.json")

# In-memory document cache to achieve sub-millisecond query responses
_cache = {
    "mtime": 0,
    "records": []
}

def get_records():
    if not os.path.exists(DOCUMENTS_JSON):
        return []
    mtime = os.path.getmtime(DOCUMENTS_JSON)
    if _cache["records"] and _cache["mtime"] == mtime:
        return _cache["records"]
    with open(DOCUMENTS_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)
        records = data.get("data", [])
        _cache["records"] = records
        _cache["mtime"] = mtime
        return records

class AshlarDevHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for local development
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-LN-Response, Idempotency-Key")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Transparently emulate demo/admin/data/api.php
        if path.endswith("/data/api.php") or path.endswith("/api.php"):
            self.handle_api_php(parsed)
            return

        super().do_GET()

    def handle_api_php(self, parsed):
        try:
            records = get_records()
            if not records:
                self.send_response(404)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"data": [], "error": "Data file not found."}).encode("utf-8"))
                return

            grand_total = len(records)
            params = urllib.parse.parse_qs(parsed.query)

            # 1. Search text filter (token wildcard matching across search fields)
            search_term = params.get("search", [""])[0].strip() or params.get("q", [""])[0].strip()
            tokens = [t.lower() for t in search_term.split() if t]

            # 2. Category / enum filters
            dept_param = params.get("department", [""])[0]
            depts = {d.strip() for d in dept_param.split(",") if d.strip()} if dept_param else set()

            status_param = params.get("status", [""])[0]
            statuses = {s.strip() for s in status_param.split(",") if s.strip()} if status_param else set()

            prio_param = params.get("priority", [""])[0]
            prios = {p.strip() for p in prio_param.split(",") if p.strip()} if prio_param else set()

            filtered = []
            for r in records:
                if depts and r.get("department") not in depts:
                    continue
                if statuses and r.get("status") not in statuses:
                    continue
                if prios and r.get("priority") not in prios:
                    continue
                if tokens:
                    searchable = " ".join([
                        str(r.get("title", "")),
                        str(r.get("department", "")),
                        str(r.get("owner", "")),
                        " ".join(r.get("tags") or []) if isinstance(r.get("tags"), list) else str(r.get("tags", "")),
                        str(r.get("status", "")),
                        str(r.get("priority", ""))
                    ]).lower()
                    if not all(tok in searchable for tok in tokens):
                        continue
                filtered.append(r)

            filtered_count = len(filtered)

            # 3. Sorting
            sort_field = params.get("sort_field", [""])[0] or params.get("sort_by", [""])[0]
            sort_dir = params.get("sort_dir", ["asc"])[0].lower()
            allowed_sort = ['id', 'title', 'department', 'status', 'priority', 'owner', 'file_size', 'created_at', 'updated_at']

            if sort_field in allowed_sort:
                reverse = (sort_dir == "desc")
                filtered.sort(key=lambda x: (x.get(sort_field) is None, x.get(sort_field)), reverse=reverse)

            # 4. Pagination
            offset_val = params.get("offset", ["0"])[0]
            limit_val = params.get("limit", ["0"])[0]
            offset = int(offset_val) if offset_val.isdigit() else 0
            limit = int(limit_val) if limit_val.isdigit() else 0

            if limit > 0:
                page_slice = filtered[offset:offset + limit]
            else:
                page_slice = filtered[offset:]

            # 5. Format display fields (file_size_display, updated_display)
            formatted_rows = []
            for item in page_slice:
                rec = dict(item)
                rec["id"] = int(rec.get("id", 0))
                b = int(rec.get("file_size", 0))
                rec["file_size"] = b
                rec["created_at"] = int(rec.get("created_at", 0))
                updated_at = int(rec.get("updated_at", 0))
                rec["updated_at"] = updated_at
                if isinstance(rec.get("tags"), str):
                    try:
                        rec["tags"] = json.loads(rec["tags"])
                    except Exception:
                        rec["tags"] = []

                rec["file_size_display"] = f"{round(b / 1048576, 1)} MB" if b >= 1048576 else f"{round(b / 1024, 1)} KB"
                rec["updated_display"] = datetime.datetime.fromtimestamp(updated_at, tz=datetime.timezone.utc).strftime("%Y-%m-%d")
                formatted_rows.append(rec)

            response_bytes = json.dumps({
                "data": formatted_rows,
                "total": grand_total,
                "filtered": filtered_count
            }).encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(response_bytes)))
            self.end_headers()
            self.wfile.write(response_bytes)

        except Exception as e:
            err_bytes = json.dumps({"error": str(e)}).encode("utf-8")
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(err_bytes)))
            self.end_headers()
            self.wfile.write(err_bytes)


def run_server():
    port = DEFAULT_PORT
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])

    # Allow fast address reuse on restarts
    socketserver.TCPServer.allow_reuse_address = True

    try:
        with socketserver.TCPServer(("", port), AshlarDevHandler) as httpd:
            print("\n" + "=" * 60)
            print(f"  ln-ashlar Local Dev Server running on port {port}")
            print("=" * 60)
            print(f"  • Root:            http://localhost:{port}/demo/index.html")
            print(f"  • Table Sync Demo: http://localhost:{port}/demo/admin/table-sync.html")
            print(f"  • List Demo:       http://localhost:{port}/demo/admin/list.html")
            print("=" * 60)
            print("  (Press Ctrl+C to stop)\n")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except OSError as e:
        print(f"\nError: Could not bind to port {port}: {e}")
        print("Try running with an alternate port: python3 scripts/serve.py 8080")
        sys.exit(1)


if __name__ == "__main__":
    run_server()
