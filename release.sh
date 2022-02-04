#!/usr/bin/env bash

sourceBranch='development'  #eks
destinationBranch='development-eks' #preprod
servicesFolder='/Users/manoj/Developer/Node/vms-opensource'
cd $servicesFolder
pwd

services=('admin-service' 'booking-service' 'communication-service' 'general-service' 'import-service' 'inventory-service' 'login-service' 'material' 'notification-service' 'provider-service' 'questionnare' 'recipient-service' 'registration-service' 'report-service' 'scheduling-service' 'seat-service' 'site-service' 'vaccinator-service' 'visit-microservice')
problems=()
problemsIndex=0
for serviceName in "${services[@]}"
do
  cd $serviceName
  pwd
  echo "Inside $serviceName"
  echo "-------------------------------------------------------------------------"

  # Get current branch and checkout if needed
  branch=$(git symbolic-ref --short -q HEAD)
  echo "Currently on ---> $branch"
  
  if [ "$branch" != "$sourceBranch" ]; then
    echo "Not on $sourceBranch"
    #reseting local changes
    git reset --hard
    git checkout $sourceBranch

    branch=$(git symbolic-ref --short -q HEAD)
    echo "Checked out to ---> $branch"
  fi
  
  # Ensure working directory in version branch clean
  git update-index -q --refresh
  if ! git diff-index --quiet HEAD --; then
    problems[$problemsIndex]=$serviceName
    ((problemsIndex+=1))
    echo $problemsIndex
    echo "Working directory not clean, please commit your changes first"
    continue
  fi
  #reseting local changes
  #git reset --hard
  #getting the latest code in the branch
  #git pull origin $sourceBranch

  git checkout $destinationBranch
  #getting the pull of destination branch
  if git pull origin ${sourceBranch}
  then
    echo "Pull from ${sourceBranch} successfull"
    #pushing the source branch
    git push origin ${destinationBranch}
  else
    echo "Pull failed"
    problems[$problemsIndex]=$serviceName
    ((problemsIndex+=1))
    echo $problemsIndex
  fi

  cd ../
done

echo "-----------------------------------------------------"
echo "Script finished"
echo "-----------------------------------------------------"
echo "Problems in ---> ${problems[@]}"