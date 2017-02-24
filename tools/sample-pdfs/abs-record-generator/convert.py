import urllib2
import csv
import argparse
import sys
from cfa_student import Student, StudentsGroup

# Get args and parse
parser = argparse.ArgumentParser()
parser.add_argument('-n', action='store', dest='num_records', help='Number of records to create: default 1')
parser.add_argument('-v', action='store', dest='verbose_mode', help='Enable Verbose Mode: default False')
args = parser.parse_args()

if not args.num_records:
    num_records = 1
else:
    num_records = int(args.num_records);

if not args.verbose_mode:
    verbose = False
else:
    verbose = True

# Begin main script
mockaroo_url = 'http://mockaroo.com/538c36e0/download?count=500&key=5377bd10'
response = urllib2.urlopen(mockaroo_url)
csv_cfa_f = csv.reader(response)
headers = csv_cfa_f.next()
inc = 5

arr = list()

for row in csv_cfa_f:
    arr.append(Student(row[0], row[1], row[3], row[-2], 
                    row[-3], row[2], row[-1]))

ar_object = StudentsGroup(arr, headers)

print "\n==fcc-cfa pdf dataset generator==\n"
print "fetching csv file using mockaroo...\n"
print "Fetching Headers..."
for header in headers:
    print "\t%s" % header
print "\nReformatting records...\n"

if num_records == 1:
    ar_object.createOne(verbose)

else:
    print "Creating %d files..." % num_records
    ar_object.createMultiple(num_records, inc, verbose)
    
print "Process Complete!\n"