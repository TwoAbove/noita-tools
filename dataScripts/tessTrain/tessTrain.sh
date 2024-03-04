#!/bin/bash
set -e

# Tested on a bare install of Ubuntu 22.04.3 LTS - 02/27/2024
# Author: Charles@CharlesBock.com - github.com/Penguin2600

# Color Stuff
BGreen='\033[1;32m'
NC='\033[0m'

greentext () {
   echo -e "\n${BGreen}### $1 ${NC}\n"
}

# Build tesseract
# Upstream Docs: https://tesseract-ocr.github.io/tessdoc/Compiling-%E2%80%93-GitInstallation#installing-with-autoconf-tools
greentext "Installing Deps and Creating File Structure"

# Dont polute the directory
mkdir -p ./tess
cd tess
pwd

# Get Deps
sudo apt-get install libicu-dev libpango1.0-dev libcairo2-dev
sudo apt-get install automake ca-certificates g++ git libtool libleptonica-dev make pkg-config
sudo apt-get install libpango1.0-dev libleptonica-dev

greentext "Cloning Tesseract"

git clone https://github.com/tesseract-ocr/tesseract.git 2> /dev/null || (cd tesseract ; git pull; cd ..)

# Build the training tools
# Upstream Docs: https://tesseract-ocr.github.io/tessdoc/Compiling-%E2%80%93-GitInstallation#build-with-training-tools
greentext "Building Tesseract WITH Training Tools - This can take a long time"

sudo apt-get install libicu-dev
sudo apt-get install libpango1.0-dev
sudo apt-get install libcairo2-dev

cd tesseract

./autogen.sh
./configure
make
sudo make install
sudo ldconfig
make training
sudo make training-install

greentext "Finished Building Teseract and Training Tools"

cd ..
pwd

# Install and configure tesstrain
# Upstream Docs: https://github.com/tesseract-ocr/tesstrain?tab=readme-ov-file#choose-model-name

greentext "Pulling the required ENG traineddata from github"
wget https://github.com/tesseract-ocr/tessdata/raw/main/eng.traineddata
sudo mv eng.traineddata /usr/local/share/tessdata

greentext "Cloning Tesstrain"
git clone https://github.com/tesseract-ocr/tesstrain.git 2> /dev/null || (cd tesstrain ; git pull; cd ..)
cd tesstrain
pwd

greentext "Generating Tesstrain Langdata"
make tesseract-langdata

greentext "Creating and populating tesstrain ground truth Directory Structure"
mkdir -p ./data/noita-ground-truth

# Copy our example data in
cp -ar ../../truth/example_truth/* ./data/noita-ground-truth

greentext "Running Example Training - This can take some time"
# Run training against our example data
make training MODEL_NAME=noita

if test -f ./data/noita.traineddata; then
  greentext "Example Model was trained successfully"
  greentext "Setup is complete and tested"
  greentext "You are now ready for Training"

  exit 0
fi