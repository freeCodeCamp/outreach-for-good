# Child First Authority Vagrant

A Vagrantfile provisioned with Ansible that sets up a dev environment for the Child First Authority project.

Current configurations do not support Windows due to NFS mounting of shared folders.

It could be modified easily to be used with a windows machine by removing a couple lines or adding smb support. See https://github.com/blinkreaction/boot2docker-vagrant for a reference to how that might be accomplished.

# Prerequisites - `Vagrantfile`

* Vagrant (http://docs.vagrantup.com/v2/installation/index.html)
* Virtualbox (https://www.virtualbox.org/wiki/Downloads)
* Ansible (http://docs.ansible.com/ansible/intro_installation.html#installation)

* vagrant-hostmanager (https://github.com/smdahlen/vagrant-hostmanager)
* vagrant-vbguest (https://github.com/dotless-de/vagrant-vbguest)


If you have homebrew (http://brew.sh/) and homebrew cask (http://caskroom.io/):

    $ brew cask install virtualbox
    $ brew cask install virtualbox-extension-pack
    $ brew cask install vagrant
    $ brew install ansible

# Setup and Usage

Fork the repository on github and clone to a local directory that will be the vagrant folder.

Make copy of `provisioning/group_vars/all.yml.example` as
`provisioning/group_vars/all.yml` and update vars before running vagrant up.

Install vagrant plugins on the host:

        $ vagrant plugin install vagrant-hostmanager
        $ vagrant plugin install vagrant-vbguest

Bring up the vm and wait for ansible to provision it.

    projectdir$ vagrant up

This first vagrant up will take a fairly long time to complete (~30 mins).

# Prerequisites - `Vagrantfile.libvirt`

Linux workstations already running qemu/libvirt can make use of Vagrantfile.libvirt with native linux utillities
to build a similar development environment. The `vagrant-libvirt` plugin is required.

```
mv Vagrantfile Vagrantfile.vbox
mv Vagrantfile.libvirt Vagrantfile
vagrant up
```

While `vagrant-libvirt` supports shared folders and forwarded ports, due to differing environments such
tasks are left to the developer. An example using sshfs/ssh is included below.

```
sshfs -o reconnect,port=22,idmap=user,allow_other vagrant@192.168.121.100:/vagrant/app ~/vagrant
ssh -N -L 9000:localhost:9000 -p 22 vagrant@192.168.121.100
ssh -N -L 35729:localhost:35729 -p 22 vagrant@192.168.121.100
ssh -N -L 27017:localhost:27017 -p 22 vagrant@192.168.121.100
ssh -N -L 5858:localhost:5858 -p 22 vagrant@192.168.121.100
```

# Post provisioning

Next step is to fork and clone the app repository into the app directory. First go to https://github.com/child-first-authority-fcc-project/webapp and fork the project. Copy the clone url and on the host:

    projectdir$ git clone <clone url> app

When this completes you can ssh into the vm from the host machine using:

    projectdir$ vagrant ssh
    vagrant@dev:/vagrant/app$

Next make a copy of the `local.env.sample.js` file to the untracked `local.env.js`:

    vagrant@dev:/vagrant/app$ cp server/config/local.env.sample.js server/config/local.env.js

Run bower and npm install to install the app dependencies:

    vagrant@dev:/vagrant/app$ bower install && npm install

See if everything is working by running Grunt:

    vagrant@dev:/vagrant/app$ grunt

To run the dev server use:

    vagrant@dev:/vagrant/app$ grunt serve

## Notes

**Currently using Node 0.12.7:** There are some issues with dependencies of angular fullstack when using node 4.x.

**These commands do not need to be run again:** There are a few bugs with the angular fullstack generator install. To fix these problems these npm packages were manually installed:

    npm install grunt-contrib-imagemin --save-dev
    npm install karma-phantomjs-launcher --save-dev

# Workflow

The editing of the files should be done on the host machine. The changes will be picked up by the vm and reflected via livereload to the host browsers pointed at the http://<vm's ip (default:192.168.111.222)>:9000 or http://localhost:9000 when the grunt serve task is running in the vm.

## ssh-agent-forwarding

ssh-agent-forwarding is used so git can be used seemlessly on the vagrant web vm. You can read an in depth over article about it here:

http://www.unixwiz.net/techtips/ssh-agent-forwarding.html

On the host in ~/.ssh/config add:

    Host 192.168.111.222
      ForwardAgent yes

Store the pass phrases on your keychain:

    $ ssh-add -K

From inside the vm (vagrant ssh):

    vagrant@dev:/vagrant/app$ ssh -T git@github.com

and you should see something like:

    The authenticity of host 'github.com (192.30.252.131)' can't be established.
    RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
    Are you sure you want to continue connecting (yes/no)? yes
    Warning: Permanently added 'github.com,192.30.252.131' (RSA) to the list of known hosts.
    Hi dting! You've successfully authenticated, but GitHub does not provide shell access.
