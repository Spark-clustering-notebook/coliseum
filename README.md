# Coliseum
LIPN docker image for demonstration purpose.

See (https://hub.docker.com/r/spartakus/coliseum/)[https://hub.docker.com/r/spartakus/coliseum/] for online image.

## Build
```bash
docker build -t spartakus/coliseum:0.0.1 .
```

## Run
This uses a variable `LOCAL_NOTEBOOKS` which refers to a local directory containing the notebooks you want to include and keep up to date during the session.

Another folder you might want to sync is the data dir, which uses `LOCAL_DATA` then.


```bash
export LOCAL_NOTEBOOKS=<path to local notebooks dir>
export LOCAL_DATA=<path to local data dir>
docker run -v $LOCAL_NOTEBOOKS:/root/spark-notebook/notebooks/coliseum \
           -v $LOCAL_DATA:/root/data/coliseum \
           --rm -it -m 8g \
           -p 19000:9000 \
           -p 14040:4040 -p 14041:14041 -p 14042:4042 -p 14043:14043 \
           spartakus/coliseum:0.0.1 \
           bash
```

Then
```bash
source var.sh
source start.sh
source create.sh
```

## Access
Open browser at [http://localhost:19000/tree/coliseum](http://localhost:19000/tree/coliseum).

> WARN:
> 
> If you're running docker via a VM (Mac, Msft, ...) then you need to replace `localhost` by the VM's IP.
