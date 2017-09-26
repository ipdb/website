#!/usr/bin/env bash

set -e;

echo "$(tput setaf 136)"
echo "============================================="
echo "              Starting tests "
echo "============================================="
echo "$(tput sgr0)" # reset

npm test

echo "$(tput setaf 64)" # green
echo "---------------------------------------------"
echo "           ✓ done testing"
echo "---------------------------------------------"
echo "$(tput sgr0)" # reset


echo "$(tput setaf 136)"
echo "============================================="
echo "              Starting build "
echo "============================================="
echo "$(tput sgr0)" # reset

##
## check for pull request against master
##
if [ "$TRAVIS_PULL_REQUEST" != "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then

    gulp build --staging


##
## check for master push which is no pull request
##
elif [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

    gulp build --production

else

    gulp build --production

fi;


echo "$(tput setaf 64)" # green
echo "---------------------------------------------"
echo "           ✓ done building"
echo "---------------------------------------------"
echo "$(tput sgr0)" # reset
