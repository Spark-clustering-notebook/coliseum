# Coliseum
LIPN CNRS UMR 7030  (https://github.com/Spark-clustering-notebook/coliseum/wiki) docker image for demonstration purpose.

See (https://hub.docker.com/r/spartakus/coliseum/) for online image.

## Docker
First you need to pull the docker image locally.

```sh
docker pull spartakus/coliseum:0.3.0
```

Then you can run the container with these parameters:
* `--rm` cleans the container at shutdown
* `-it` starts the container in iteractive mode
* `-m 8g` allocates `8Gb` to the container
* `--net=host` means that the container isn't using a dedicated (virtalized) network, but the current host one (on Mac this is the networking used by the virtual machine though)

```sh
docker run --rm -it -m 8g --net=host spartakus/coliseum:0.3.0 bash
```

> Note for developers, check the **Development** section below.

## Start
In the started shell, use the following commands

```bash
source var.sh
source start.sh
source create.sh
```

## Access
> **For Mac, Msft users**:
> 
> You're running docker via a VM then you need to replace `localhost` by the VM's IP which can be retrieved this way.
> ```sh
> boot2docker ip
> ```

Open browser at [http://localhost:9000/tree/coliseum](http://localhost:9000/tree/coliseum).

# Development
## Build
```bash
docker build -t spartakus/coliseum:0.3.0 .
```

## Dependencies
Until libraries are deployed publicly, we'll have to build them locally in 
* ivy2 if scala 2.10
* m2 if scala 2.11

Then refer them from the notebooks using the artifact id in the metadata, and we mount the local repository in the docker container (see below section).

## Deploy dependencies
### Mean-Shift LSH
On the host machine (that runs docker), we need to deploy the dependency locally, then we'll make it available in docker (using folder mounting).


```sh
git clone https://github.com/Spark-clustering-notebook/Mean-Shift-LSH.git
cd Mean-Shift-LSH
sbt publishM2
sbt publishLocal
```

When ready to release on Bintray, use `publish` instead.

### G-Stream

```sh
git clone https://github.com/Spark-clustering-notebook/G-stream.git
cd G-stream
sbt publishM2
sbt publishLocal
```

### SOM-MR

```sh
git clone https://github.com/Spark-clustering-notebook/SOM-MR-2.git
cd SOM-MR-2
sbt publishM2
sbt publishLocal
```


When ready to release on Bintray, use `publish` instead.

## Run container
This uses a variable `LOCAL_NOTEBOOKS` which refers to a local directory containing the notebooks you want to include and keep up to date during the session.

Another folder you might want to sync is the data dir, which uses `LOCAL_DATA` then.

Also, it's recommended to use your own ivy repository, especially because some libs aren't available online (like mean shift lsh), hence you can `publishLocal` any libs on the host machine then point you `.ivy2` to the docker container's ones. This will use the `$HOST_REPO`.


```bash
export LOCAL_NOTEBOOKS=<path to local notebooks dir>
export LOCAL_DATA=<path to local data dir>
export HOST_REPO=$(realpath $HOME/.ivy2)
docker run \
           -v $LOCAL_NOTEBOOKS:/root/spark-notebook/notebooks/coliseum \
           -v $HOST_REPO:/root/.ivy2 \
           -v $LOCAL_DATA:/root/data/coliseum \
           --rm -it -m 8g \
           -p 19000:9000 \
           -p 14040:4040 -p 14041:14041 -p 14042:4042 -p 14043:14043 \
           spartakus/coliseum:0.3.0 \
           bash
```
