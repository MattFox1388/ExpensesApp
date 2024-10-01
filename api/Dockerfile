FROM bitnami/python:3.9-debian-11
WORKDIR /Budget_API
ADD . /Budget_API
RUN apt-get update
RUN apt-get install python3-dev default-libmysqlclient-dev gcc  -y
RUN pip install -r requirements.txt
RUN ["chmod",  "a+x", "./entrypoint.sh"]
ENTRYPOINT ["sh", "./entrypoint.sh"]