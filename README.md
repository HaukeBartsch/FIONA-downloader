npm run make -- --arch="arm64,x64"

## Test server

```
php -d max_execution_time=60 -S localhost:3000 
```

### User testing 

> [!NOTE] Instructions:
> - Import list of file to download from data.fiona (fiona-downloader folder)
> - Set the output directory to “out” (fiona-download folder)
> - Download all data, find out what went wrong


Feedback 1: Immediately made the window higher. File selection box is in the way. Press download button without setting download location. Tried to click on failed row and on "failed" nothing happens. Cannot close username/password dialog.
