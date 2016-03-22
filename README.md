# Coliseum
LIPN CNRS UMR 7030  (https://lipn.univ-paris13.fr/bigdata) docker image for demonstration purpose.

See (https://hub.docker.com/r/spartakus/coliseum/) for online image.

## Build
```bash
docker build -t spartakus/coliseum:0.0.1 .
```

## Dependencies
Until libraries are deployed publicly, we'll have to build them locally in 
* ivy2 if scala 2.10
* m2 if scala 2.11

Then refer them from the notebooks using the artifact id in the metadata, and we mount the local repository in the docker container (see below section).

### Deploy dependencies
#### Mean-Shift LSH

```sh
git clone git@github.com:Spark-clustering-notebook/Mean-Shift-LSH.git
cd Mean-Shift-LSH
sbt publishM2
sbt publishLocal
```


## Run
This uses a variable `LOCAL_NOTEBOOKS` which refers to a local directory containing the notebooks you want to include and keep up to date during the session.

Another folder you might want to sync is the data dir, which uses `LOCAL_DATA` then.

Also, it's recommended to use your own ivy repository, especially because some libs aren't available online (like mean shift lsh), hence you can `publishLocal` any libs on the host machine then point you `.ivy2` to the docker container's ones. This will use the `$HOST_REPO`.


```bash
export LOCAL_NOTEBOOKS=<path to local notebooks dir>
export LOCAL_DATA=<path to local data dir>
export HOST_REPO=$(realpath $HOME/.ivy2)
docker run -v $LOCAL_NOTEBOOKS:/root/spark-notebook/notebooks/coliseum \
           -v $HOST_REPO:/root/.ivy2 \
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
