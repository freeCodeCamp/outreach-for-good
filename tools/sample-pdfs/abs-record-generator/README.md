# CFA dataset generator  

## Summary

This python script uses mockaroo, an online data generator, to create a standard csv template. Data is then converted into an app readable format via python script. Data is fairly simmilar to those in the google docs, with the addition of randomly generated student names via [mockaroo](http://www.mockaroo.com).  

If you're interested in creating tests based on several weeks data, the google document spreadsheet records may be of better use to you.  

Tested on python 2.7.11. Script uses the following dependencies that can be installed using pip:  

- urllib2  
- csv  
- argparse

## Setup  

Sample pdfs can be generated with this tool by doing the following:  

*If you have run this script before, be sure to delete the csv file that was created prior to running the script again.*

1. Run `python convert.py`. This will create a csv file in your current directory. To create a series of records, use the `-n=<num_of_records_in_series>` argument.   
2. Open the csv in google spreadsheets. Allow spreadheets to auto detect your delimiter.  
3. In the menu, go to *'File > Download as > pdf document (.pdf)'*. In Layout, choose *'Actual Size'* and *'Portrait'*.  

*You can also use a service like https://convertio.co to convert the csv files to pdf format*

Your pdf should then be the appropriate file type and format for uploading to the CFA app.  

To customize the mockaroo models, go to http://mockaroo.com/538c36e0. After you make your customizations, replace the variable `mockaroo_url` with your new schema url.

### Other Files  

- `cfa_student.py`: Holds the Student and StudentGroup objects where all parsing logic is stored.
- `test.py`: Tests the data integrity of the Student and StudentGroup objects.