# Ansible Role: nvm

<!-- [![Build Status](https://travis-ci.org/linconf/ansible-openssl.svg?branch=master)](https://travis-ci.org/linconf/ansible-openssl)
[![Ansible Galaxy](https://img.shields.io/badge/docs-ansible--openssl-blue.svg)](http://linconf.com/ansible-openssl/)
[![Ansible Galaxy](https://img.shields.io/badge/galaxy-linconf.openssl-660198.svg)](https://galaxy.ansible.com/linconf/openssl/)
 -->
An Ansible role that manages nvm on Debian/Ubuntu.


Readme and tests coming soon.
<!-- 
## Installation

```
ansible-galaxy install linconf.nvm
```

## Example Playbooks

**Add a Self-Signed Certificate**

```
- hosts: localhost
  roles:
    - linconf.openssl
  vars:
    openssl_add_cert:
      - path: '{{ ansible_fqdn }}/myservice'
        crt_name: '{{ ansible_hostname }}.myservice.pem'
        key_name: '{{ ansible_hostname }}.myservice.key'
        common_name: 'myservice.com'
```

**Renew a Self-Signed Certificate**

Note: The expired certificate is backed up to `certname.pem.{ current-date }`. Manual intervention
would be required if you attempted to renew more than once per day.

```
- hosts: localhost
  roles:
    - linconf.openssl
  vars:
    openssl_add_cert:
      - path: '{{ ansible_fqdn }}/myservice'
        crt_name: '{{ ansible_hostname }}.myservice.pem'
        key_name: '{{ ansible_hostname }}.myservice.key'
        common_name: 'myservice.com'
        renew: True
```

**Optional: ssl-cert-check**

This role can optionally install [ssl-cert-check](https://github.com/Matty9191/ssl-cert-check) to 
notify you when certificates near expiration.

```
openssl_check_cert: True
openssl_check_cert_email: 'you@example.com'
``` -->

<!-- 
**Additional Options**

This role supports many more configuraiton options and actions.

See the [linconf.openssl documentation](http://linconf.com/ansible-openssl/) for a full list of available options.

 -->
## Dependencies / Requirements

- None

## Testing

Tests are coming soon

<!-- The master branch is continuously validated by Travis-CI.

Minor versions indicate the role passed local testing as described by the
`.kitchen` declaration. Instructions for performing test-kitchen runs locally
are detailed in the [LinConf Documentation](http://linconf.com/about/methodology/).
 -->


## To-Do

- None


## Author and License

Chad Sheets - [GitHub](https://github.com/cjsheets) | [Blog](http://chadsheets.com/) | [Email](mailto:chad@linconf.com)

**Ansible Role**

Released under the [MIT License](https://tldrlegal.com/license/mit-license)

[![Analytics](https://cjs-beacon.appspot.com/UA-10006093-3/github/linconf/ansible-nvm?pixel)](https://github.com/linconf/ansible-nvm)