# FIONA downloader

![Interface](https://github.com/HaukeBartsch/FIONA-downloader/blob/main/images/interface.png)

i) Download an instruction file (data.fiona) from FIONA. ii) Load the .fiona file and specify a local directly to store the exported files. iii) Press the "Download" button.

 - *Created or modified in-house or is this a third-party app?* This application is created in-house using Electron.js, a framework for creating multi-platform applications.
 - *Does it expect write access to system-wide paths?* No, the application does not need write access to system-wide paths. The application will store settings in the user's data directory. The download location for data is specified by the user, default location is the user's download directory.
 - *Does it depend on being able to execute binaries from user-writable directories?* Yes, the application is based on Electron.js which includes a Node.js/Chromium runtime environment.
 - *Do you fear that it might not work correctly if "sand-boxed"?* The application should work in a sand-boxed environment, without access to the internet for example. Access to the FIONA system is required (https) and access to the filesystem for local storage of data is also required.
 - *Does it need to communicate with any other application on the system?* No, the application does not depend on any other application on the system.
 - *Are there dependencies on other software, SDKs etc.?* The applications comes with all dependencies packaged inside the installer. It is build using a set of electron.js packages (see packages.json), such as electron-dl and electron-store.


## Build  

```bash
npm run make -- --arch="arm64,x64"
```

## Test server

```bash
php -d max_execution_time=60 -S localhost:3000 
```

### User testing 

> [!NOTE]
> Instructions:
> - Import list of file to download from data.fiona (fiona-downloader folder)
> - Set the output directory to “out” (fiona-download folder)
> - Download all data, find out what went wrong


Feedback 1: Immediately made the window higher. File selection box is in the way. Press download button without setting download location. Tried to click on failed row and on "failed" nothing happens. Cannot close username/password dialog.
