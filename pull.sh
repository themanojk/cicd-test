#!/usr/bin/env bash

sourceBranch='development-eks'  #eks
servicesFolder='/Users/manoj/Developer/Node/vms-opensource'
cd $servicesFolder
pwd

services=('admin-service' 'booking-service' 'communication-service' 'general-service' 'import-service' 'inventory-service' 'login-service' 'material' 'notification-service' 'provider-service' 'questionnare' 'recipient-service' 'registration-service' 'report-service' 'scheduling-service' 'seat-service' 'site-service' 'vaccinator-service' 'visit-microservice')
problems=()
problemsIndex=0
conflicts=()
conflictsIndex=0
for serviceName in "${services[@]}"
do
  cd $serviceName
  pwd
  echo "Inside $serviceName"
  echo "-------------------------------------------------------------------------"

  # Get current branch and checkout if needed
  branch=$(git symbolic-ref --short -q HEAD)
  echo "Currently on ---> $branch"

  # Ensure working directory in version branch clean
  git update-index -q --refresh
  if ! git diff-index --quiet HEAD --; then
    problems[$problemsIndex]=$serviceName
    ((problemsIndex+=1))
    echo $problemsIndex
    echo "Working directory not clean, please commit your changes first"
    cd ../
    continue
  fi
  
  if [ "$branch" != "$sourceBranch" ]; then
    echo "Not on $sourceBranch"
    #Checking out to source branch
    git checkout $sourceBranch

    branch=$(git symbolic-ref --short -q HEAD)
    echo "Checked out to ---> $branch"

    if git pull origin ${sourceBranch}
    then
      echo "Pull from ${sourceBranch} successfull"
      #pushing the source branch
      git push origin ${destinationBranch}
    else
      echo "Pull failed"
      conflicts[$conflictsIndex]=$serviceName
      ((conflictsIndex+=1))
      echo $conflictsIndex
    fi
  fi

  cd ../
done

echo "-----------------------------------------------------"
echo "Script finished"
echo "-----------------------------------------------------"
echo "Work not comitted in ---> ${problems[@]}"

echo "-----------------------------------------------------"
echo "Merge conflicts after taking latest pull ---> ${conflicts[@]}"