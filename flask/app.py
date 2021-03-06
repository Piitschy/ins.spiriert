from flask import Flask,redirect
import requests
import os 

app = Flask(__name__)

URL = "https://cms.spiriert.de/"
CODES = {}

headers={"Authorization":"Bearer "+str(os.getenv("TOKEN")) }
print(requests.get(URL+"items/qrcodes").json()["data"])
for item in requests.get(URL+"items/qrcodes",headers=headers).json()["data"]:
    CODES[item["Code"]] = item["id"]

print(CODES)

@app.route("/")
def root():
    return redirect("https://ins.spiriert.de")

@app.route("/<code>")
def redirect_qr(code):
    if not code in CODES:
        print(code +" not in CODES")
        return redirect("https://google.com")
    response = requests.post(URL+"items/qr_scan/",json={"code": CODES[code]},headers=headers)
    print(response, URL+"items/qr_scan/")
    return redirect("https://ins.spiriert.de")


@app.route("/update")
def update():
    for item in requests.get(URL+"/items/qrcodes",headers=headers).json()["data"]:
        CODES[item["Code"]] = item["id"]
    return ('', 204)





if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000)
