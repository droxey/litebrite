FROM python:3.7-slim-buster

RUN mkdir /app 
COPY requirements.txt /app/requirements.txt
RUN python -m pip install -q -r /app/requirements.txt

COPY . /app 
WORKDIR /app 

ENV FLASK_APP=app.py 
ENV FLASK_ENV=production 

EXPOSE 5000  
CMD ["flask", "run", "--host=0.0.0.0"]
