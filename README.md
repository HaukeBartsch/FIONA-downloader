# FIONA downloader

![Interface](https://github.com/HaukeBartsch/FIONA-downloader/blob/main/images/interface.png)

Download an instruction file (data.fiona) from FIONA. Load the .fiona file and specify a local directly to store the exported files.

## Build  

```bash
npm run make -- --arch="arm64,x64"
```

## Test server

```bash
php -d max_execution_time=60 -S localhost:3000 
```

### User testing 

> [!NOTE] Instructions:
> - Import list of file to download from data.fiona (fiona-downloader folder)
> - Set the output directory to “out” (fiona-download folder)
> - Download all data, find out what went wrong


Feedback 1: Immediately made the window higher. File selection box is in the way. Press download button without setting download location. Tried to click on failed row and on "failed" nothing happens. Cannot close username/password dialog.
