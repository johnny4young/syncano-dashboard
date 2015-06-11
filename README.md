# Installation

Project requires node 0.10.32. The best way to manage node versions
I found is [n](https://github.com/tj/n).

Installation.

    $ sudo npm install -g n
    $ n 0.10.32

Type `n` to prompt selection of an installed node.
Use the up / down arrow to navigate, and press enter or the right arrow to select, or ^C to cancel:

    $ n

      0.8.14
    ο 0.10.32
      0.9.6


Without proper node version everything tends to blow up :fire: !

With proper node:

    $ node --version
    v0.10.32

Install dependencies:

    npm install
    sudo npm install gulp -g

Start local dev version (available at https://localhost:8080/)

    npm start


# Social login

Social login requires proper configuration of env variables with newtork ids e.g:

    $ export FACEBOOK_ID='xx'
    $ export GOOGLE_ID='xx'
    $ export GITHUB_ID='xx'
    $ export OAUTH_PROXY_URL='xx'

or if you are using `fish` shell:

    $ set -g -x FACEBOOK_ID xx
    $ set -g -x GOOGLE_ID xx
    $ set -g -x GITHUB_ID xx
    $ set -g -x OAUTH_PROXY_URL xx
