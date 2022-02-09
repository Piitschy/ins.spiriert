from flask import Flask,redirect
from redis import Redis
import requests

app = Flask(__name__)
redis = Redis(host='redis', port=6379)

URL = "https://api.spiriert.de/"
CODES = {}

headers={"Authorization":"Bearer ${{ secrets.TOKEN }}"}
print(requests.get(URL+"items/qrcodes").json()["data"])
for item in requests.get(URL+"items/qrcodes",headers=headers).json()["data"]:
    CODES[item["Code"]] = item["id"]

print(CODES)

@app.route("/")
def redirect_qr_():
    return redirect("https://google.com")

@app.route("/<code>")
def redirect_qr(code):
    if not code in CODES:
        print(code +" not in CODES")
        return redirect("https://google.com")
    response = requests.post(URL+"items/qr_scan/",json={"code": CODES[code]},headers=headers)
    print(response, URL+"items/qr_scan/")
    return redirect("https://google.com")


@app.route("/update")
def update():
    for item in requests.get(URL+"/items/qrcodes",headers=headers).json()["data"]:
        CODES[item.code] = item.id
    return ('', 204)


@app.route("/users")
def update():
    for item in requests.get(URL+"/items/qrcodes",headers=headers).json()["data"]:
        CODES[item.code] = item.id
    return ('', 204)


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000)
