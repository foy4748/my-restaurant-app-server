import requests as rq

BASE_URL = "http://localhost:3001"

res = rq.post(BASE_URL+"/schedules", json={ "DATE": "20221226", "TIME":"14", "TABLE":"1", "UID":"hijibijhijibiji" })
print(res.status_code);
