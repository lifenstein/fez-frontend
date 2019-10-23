#!/bin/bash

if [[ -z $CI_BRANCH ]]; then
  CI_BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

if [[ -z $PIPE_NUM ]]; then
  PIPE_NUM=1
fi

case "$PIPE_NUM" in
"1")
    # when all branches are running pipeline 2, this codestyle check should be moved to pipeline 2, as it
    # is only used occasionally
    printf "\n--- \e[1mRUNNING CODE STYLE CHECKS\e[0m ---\n"
    printf "\n$ npm run codestyles:files -s\n"
    FILES=$(npm run codestyles:files -s)

    if [[ "$?" == 0 ]]; then
        printf "\n\e[92mLooks good! Well done.\e[0m\n\n"
    else
        printf "\n\e[91mThese files should pass code style checks but do not:\e[0m\n\n"
        for FILE in $FILES
        do
            printf "\t\e[31m$FILE\e[0m\n"
        done
        printf "\n* Please fix code styles and try again. Running '\e[1m npm run codestyles:fix:all \e[0m' is a good start."
        printf "\n* You can run '\e[1m npm run eslint \e[0m' to view ESLint code quality issues, if any.\n\n"
        exit 1
    fi

    set -e

    export TZ='Australia/Brisbane'

    printf "\n--- \e[1mRUNNING UNIT TESTS\e[0m ---\n"
    printf "Jest v"; jest --version
    # Not running code coverage check for feature branches.
    # Running in series with `runInBand` to avoid CodeShip VM running out of memory
    if [[ ($CI_BRANCH == "master" || $CI_BRANCH == "staging" || $CI_BRANCH == "production") ]]; then
        printf "(\"$CI_BRANCH\" build INCLUDES code coverage check)\n"
        printf "\n$ npm run test:unit -- --ci --runInBand\n"
        npm run test:unit -- --ci --runInBand
    else
        printf "(Build of feature branch \"$CI_BRANCH\" SKIPS code coverage check)\n"
        printf "\n$ npm run test:unit -- --ci --runInBand --no-coverage\n"
        npm run test:unit -- --ci --runInBand --no-coverage
    fi

    # Run integration tests
    printf "\n--- \e[1mRUNNING INTEGRATION TESTS\e[0m ---\n"
    printf "\n$ npm run test:integration\n"
    npm run test:integration

    # run cypress tests if in master branch, or the branch name includes 'cypress'
    # (putting * around the test-string gives a test for inclusion of the substring rather than exact match)
    if [[ $CI_BRANCH == "master" || $CI_BRANCH == *"cypress"* ]]; then
        # Use this variant to only run tests locally in Codeship
        # start-server-and-test 'npm run start:mock' http-get://localhost:3000 'cypress run --record false';

        # Use this variant to turn on the recording to Cypress dashboard and video of the tests:
         start-server-and-test 'npm run start:mock' http-get://localhost:3000 'cypress run --record --config --parallel video=true'
    fi
;;
"2")
    # codestyle check should be moved here when all branches are running codeship tests from this script

    set -e

    # run cypress tests if in master branch, or the branch name includes 'cypress'
    # (putting * around the test-string gives a test for inclusion of the substring rather than exact match)
    if [[ $CI_BRANCH == "master" || $CI_BRANCH == *"cypress"* ]]; then
        # Use this variant to only run tests locally in Codeship
        # start-server-and-test 'npm run start:mock' http-get://localhost:3000 'cypress run --record false';

        # Use this variant to turn on the recording to Cypress dashboard and video of the tests:
         start-server-and-test 'npm run start:mock' http-get://localhost:3000 'cypress run --record --config --parallel video=true'
    fi
;;
"3")
    # codestyle check should be moved here when all branches are running codeship tests from this script

    set -e

    # run cypress tests if in master branch, or the branch name includes 'cypress'
    # (putting * around the test-string gives a test for inclusion of the substring rather than exact match)
    if [[ $CI_BRANCH == "master" || $CI_BRANCH == *"cypress"* ]]; then
        # Use this variant to only run tests locally in Codeship
        # start-server-and-test 'npm run start:mock' http-get://localhost:3000 'cypress run --record false';

        # Use this variant to turn on the recording to Cypress dashboard and video of the tests:
         start-server-and-test 'npm run start:mock' http-get://localhost:3000 'cypress run --record --config --parallel video=true'
    fi
;;
esac
