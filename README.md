# FIONA downloader

![Interface](https://github.com/HaukeBartsch/FIONA-downloader/blob/main/images/interface.png)

i) Download an instruction file (data.fiona) from FIONA. ii) Load the .fiona file and specify a local directly to store the exported files. iii) Press the "Download" button.

 - *Created or modified in-house or is this a third-party app?* This application is created in-house using Electron.js, a framework for creating multi-platform applications.
 - *Does it expect write access to system-wide paths?* No, the application does not need write access to system-wide paths. The application will store settings in the user's data directory. The download location for data is specified by the user, default location is the user's download directory.
 - *Does it depend on being able to execute binaries from user-writable directories?* Yes, the application is based on Electron.js which includes a Node.js/Chromium runtime environment.
 - *Do you fear that it might not work correctly if "sand-boxed"?* The application should work in a sand-boxed environment, without access to the internet for example. Access to the FIONA system is required (https) and access to the filesystem for local storage of data is also required.
 - *Does it need to communicate with any other application on the system?* No, the application does not depend on any other application on the system.
 - *Are there dependencies on other software, SDKs etc.?* The applications comes with all dependencies packaged inside the installer. It is build using a set of electron.js packages (see packages.json), such as electron-dl and electron-store.

### Details

The .fiona file is a simple text file with two comma separated values (filename, MD5SUM). 

```csv
# an example FIONA downloader file to pull data from a project
Command_Line_Tools_for_Xcode_15.3.dmg,68c4eb65b578d9e8165af18845aa6161
ISLES-2022.zip,302ee280373cdd5c190ab763d72a7a50
redcap14.2.1.zip,0ce24bc5bf9581fffdee25329b225f35
freesurfer-linux-centos8_x86_64-7.4.1.tar.gz,93d67e5c811d80a82260ea5b4846dae3
Obsidian-1.4.16-universal.dmg,c0e51932794b743e1bd33c7c48b03c2c
```

The downloader will test each downloaded file based on the MD5SUM to verify that the download was successful. If the output folder already contains some or all of the files the MD5SUM will be tested again but only new files will download.


## Build  

Use electron-builder as a "devDependencies" entry in package.json. Build for all platforms with:

```bash
# npm run make -- --arch="arm64,x64"
./node_modules/.bin/electron-builder -mwl
```

## Test server

```bash
cd test-server
php -d max_execution_time=60 -S localhost:3000 
open http://localhost:3000
```

### User testing 

> [!NOTE]
> Instructions:
> - Import list of file to download from data.fiona (fiona-downloader folder)
> - Set the output directory to “out” (fiona-download folder)
> - Download all data, find out what went wrong


Feedback 1: 
- Immediately made the window higher: Window is now higher - more square. 
- File selection box is in the way: Still opens up automatically but can be canceled and new File/Load function. 
- Press download button without setting download location: TODO 
- Tried to click on failed row and on "failed" nothing happens: TODO 
- Cannot close username/password dialog: Added close icon on top right. Changed "Login" to "Login to FIONA".
