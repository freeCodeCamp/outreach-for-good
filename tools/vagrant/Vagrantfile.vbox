# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  # Uncomment to use hostmanager plugin
  config.hostmanager.enabled = true
  config.hostmanager.manage_host = true
  config.hostmanager.ignore_private_ip = false

  config.vm.provider "virtualbox" do |v|
    v.customize ["modifyvm", :id, "--memory", "2048"]
  end

  # On host > ~/.ssh/ssh-add -K
  config.ssh.forward_agent = true

  config.vm.network "forwarded_port", guest: 9000, host: 9000, nic_type: "82545EM"
  config.vm.network "forwarded_port", guest: 35729, host: 35729, nic_type: "82545EM"
  config.vm.network "forwarded_port", guest: 27017, host: 2701, nic_type: "82545EM"

  # Add to host > ~/.ssh/config
  #   Host 192.168.111.222
  #     ForwardAgent yes
  config.vm.network :private_network, ip: "192.168.111.222"
  config.vm.hostname = "dev.vagrant"

  config.vm.synced_folder ".", "/vagrant",
      type: "nfs",
      mount_options: ["nolock", "vers=3", "tcp", "actimeo=1"]
    config.nfs.map_uid = Process.uid
    config.nfs.map_gid = Process.gid

  config.vm.provision "ansible" do |ansible|
    # ansible.verbose = "vvvv"
    ansible.playbook = "provisioning/main.yml"
  end
end
