# go-btfs

## 1. Docs
- [Github](https://github.com/bittorrent/go-btfs)
- [Page](https://docs.btfs.io/docs/install-run-btfs20-node)

## 2. How to run ?

### Docker-compose

```
make boot
```

or 
```
ENV=testnet make boot
```

The configuration in `compose/testnet.yml` file is also for the testnet.

```
environment:
      - BTFS_PROFILE=storage-host-testnet
```

- BTFS needs BTT to run, you can get BTT from [BTTC testnet](https://testfaucet.bt.io/#/)

- Check the BTT address at [:5001/hostui](http://0.0.0.0:5001/hostui)

### 2.1 If you are running on `ubuntu` please run with

```
ARCH=ubuntu make boot
```

- Default image running on macos


## 3. Configuration

### 
Configure cross-origin(CORS)
You need to configure cross-origin (CORS) to access the container from the host.
```
(host) docker exec -it btfs1 /bin/sh
```

Then configure cross-origin(CORS) with btfs

```
(container) btfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://$IP:$PORT"]'
(container) btfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
```

E.g:
```
(container) btfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:5001"]'
(container) btfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
```

Exit the container and restart the container
```
(container) exit
(host) docker restart btfs1
```

You can access the container from the host with http://localhost:5001/webui.

Execute commands within the docker container:
```
docker exec CONTAINER btfs add FILE
```

It will return the hash of the file. You can access the file with the hash.

```
http://localhost:5001/btfs/$HASH
```


## 4. How to use ?

### Simple commands:

```
    btfs add <filename>
    btfs cat <hash>
    btfs ls <hash>
    btfs refs <hash>
    btfs pin add <hash>
    btfs pin rm <hash>
    btfs pin ls

```


### Full commands:

```
  btfs  - Global p2p merkle-dag filesystem.

  btfs [--config=<config> | -c] [--debug | -D] [--help] [-h] [--api=<api>] [--offline] [--cid-base=<base>] [--upgrade-cidv0-in-output] [--encoding=<encoding> | --enc] [--timeout=<timeout>] <command> ...

SUBCOMMANDS
  BASIC COMMANDS
    init          Initialize btfs local configuration
    add <path>    Add a file to BTFS
    cat <ref>     Show BTFS object data
    get <ref>     Download BTFS objects
    ls <ref>      List links from an object
    refs <ref>    List hashes of links from an object

  BTFS COMMANDS
    storage       Manage client and host storage features
    rm            Clean up locally stored files and objects

  DATA STRUCTURE COMMANDS
    block         Interact with raw blocks in the datastore
    object        Interact with raw dag nodes
    files         Interact with objects as if they were a unix filesystem
    dag           Interact with IPLD documents (experimental)
    metadata      Interact with metadata for BTFS files

  ADVANCED COMMANDS
    daemon        Start a long-running daemon process
    mount         Mount an BTFS read-only mount point
    resolve       Resolve any type of name
    name          Publish and resolve BTNS names
    key           Create and list BTNS name keypairs
    dns           Resolve DNS links
    pin           Pin objects to local storage
    repo          Manipulate the BTFS repository
    stats         Various operational stats
    p2p           Libp2p stream mounting
    filestore     Manage the filestore (experimental)

  NETWORK COMMANDS
    id            Show info about BTFS peers
    bootstrap     Add or remove bootstrap peers
    swarm         Manage connections to the p2p network
    dht           Query the DHT for values or peers
    ping          Measure the latency of a connection
    diag          Print diagnostics

  TOOL COMMANDS
    config        Manage configuration
    version       Show btfs version information
    commands      List all available commands
    cid           Convert and discover properties of CIDs
    log           Manage and show logs of running daemon

  Use 'btfs <command> --help' to learn more about each command.

  btfs uses a repository in the local file system. By default, the repo is
  located at ~/.btfs. To change the repo location, set the $BTFS_PATH
  environment variable:

    export BTFS_PATH=/path/to/btfsrepo
```

5. API Reference
- Add file:
  ```
  curl -X POST "http://localhost:5001/api/v1/add?chunker=reed-solomon" -F "file=@<filename>"
  ```

- Get file:
  ```
  curl -X POST "http://localhost:5001/api/v1/get?arg=<hash>"
  ```

  or
  
  ```
  curl http://localhost:8080/btfs/<hash>
  ```


### BTFS Gateway

BTFS Gateway is a free service that allows you to retrieve files from the BTFS network in your browser directly.

[How to use BTFS Gateway](https://docs.btfs.io/docs/btfs-gateway-user-guide-1)

