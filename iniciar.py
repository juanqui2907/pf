"""
TerraShield — Iniciador
Doble clic para abrir la aplicación en el navegador.
"""
import http.server
import socketserver
import webbrowser
import threading
import os

PORT = 8000

os.chdir(os.path.dirname(os.path.abspath(__file__)))

def abrir_navegador():
    import time
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}')

threading.Thread(target=abrir_navegador, daemon=True).start()

print("=" * 42)
print("  TERRASHIELD v1.0.0")
print(f"  Corriendo en http://localhost:{PORT}")
print("  Cierre esta ventana para detener.")
print("=" * 42)

with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    httpd.serve_forever()
