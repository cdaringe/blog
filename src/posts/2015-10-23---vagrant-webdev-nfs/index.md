---
title: "Vagrant NFS for webdev"
slug: "/vagrant-webdev-nfs"
date: "2015-10-24T02:39:24.000Z"
featured: false
draft: false
tags: []
---

The default shared folder I/O used by vagrant to facilitate host <==> guest file sharing is _slow_. So slow that we have observe common operations, such as `git status`, take upwards of 15 seconds. Gaaazoooks!

# solution?

The most commonly listed solution is to try Vagrant's built in NFS capability. Using nfs w/ vagrant is not too hard. to activate:

1. add a private network in your Vagrantfile
1. specify the share to be NFS in your Vagrantfile

```rb
config.vm.network "private_network", ip: "10.1.2.3"
config.vm.synced_folder "/coins/localcoin/coins", "/coins", type: "nfs"
```

Vagrant will then modify your Host OS to start an nfs share broadcast on the local ip, which the guest machine can mount. Slick!

Great, what's the file I/O difference? Well, that's a complicated question. It's one of latency, and perf while streaming. As a webteam, _one_ of our biggest concerns is serving many small files. Webservers do constant file io over many small files.

Let's look at some perf:

```bash
cdieringer@localcoin:/var/www/html/coins_core$ dd if=/dev/zero of=/coins/www/html/testfile bs=512 count=1000 oflag=direct
1000+0 records in
1000+0 records out
512000 bytes (512 kB) copied, 0.205619 s, 2.5 MB/s
cdieringer@localcoin:/var/www/html/coins_core$ sudo dd if=/dev/zero of=/root/testfile bs=512 count=1000 oflag=direct
1000+0 records in
1000+0 records out
512000 bytes (512 kB) copied, 0.0724261 s, 7.1 MB/s
```

This test writes 1000x 512byte files. The results are ~3x slower than just writing to the VM virtual disk vs writing to the NFS mount.

That is, however, a gross misrepresentation of overall file io. I was not interested in designing a suite of tests, and figured someone already had. [Here](http://mitchellh.com/comparing-filesystem-performance-in-virtual-machines), a wide range of empirical perf tests have been run. As you can see, NFS is always an order of magnitude above the shared folder default, but normal internal VM file io or VMWare file i/o tend to crush all other mechanisms.

## Is NFS good enough?

- my impressions from tooling around is that it's still less-than-desirable. There are still lags doing common commands (e.g. git status). it's more desireable to have a good performing, all-around-capable file i/o mechanism vs. one that is good in some circumstances, and poor in others.
- NFS comes with a file permissions complication. UID and GID mapping means maintenance on both host and guest boxes, and limited control of _changing_ perms throughout.

### conclusion

- let us not pursue use of it, internally, as a team
- let us use the virtualbox/vagrant config as 'remote server', or go full VMWare to get the file i/o perf!
