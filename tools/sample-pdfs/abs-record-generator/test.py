import urllib2
import csv
import sys
from cfa_student import Student, StudentsGroup

mockaroo_url = 'http://mockaroo.com/538c36e0/download?count=10&key=5377bd10'
response = urllib2.urlopen(mockaroo_url)
csv_cfa_f = csv.reader(response)
headers = csv_cfa_f.next()

test_data = list()

for row in csv_cfa_f:
	test_data.append(row)

print "\n*****"
print "CFA Data Genearator Test Suite -- BEGIN\n"
print "Test Data from mockaroo:"
print "Headers: {0}".format(len(headers))

for header in headers:
	if header == headers[-1]:
		sys.stdout.write(header + "\n")
	else:	
		sys.stdout.write(header + " ")

for i in range(0, len(test_data)):
	print "{0}: {1}".format(i, test_data[i])

print "\nTest Obj integrity...\n"

print "Student Object"
student_test_one = Student(test_data[0][0], test_data[0][1], test_data[0][3], test_data[0][-2], 
													 test_data[0][-3], test_data[0][2], test_data[0][-1])

print "name: {0}".format(test_data[0][0] == student_test_one.name)
print "sid: {0}".format(test_data[0][1] == student_test_one.sid)
print "absences: {0}".format(int(test_data[0][3]) == student_test_one.absences)
print "tdy: {0}".format(int(test_data[0][-2]) == student_test_one.tdy)
print "present: {0}".format(int(test_data[0][-3]) == student_test_one.present)
print "enrolled: {0}".format(int(test_data[0][2]) == student_test_one.enrolled)
print "school_year: {0}".format(test_data[0][-1] == student_test_one.school_year)

print "\nStudentsGroup Object"

student_object_array = list()

for row in test_data:
	student_object_array.append(Student(row[0], row[1], row[3], row[-2], 
															row[-3], row[2], row[-1]))

students = StudentsGroup(student_object_array, headers)

print "Successful Data Transfer:"
print len(students.group) == len(student_object_array)

print "Headers Check:"
for i in range(0, len(headers)):
	print "header: {0} -- {1}".format(headers[i], headers[i] == students.headers[i])

print "Group Array check:"
for i in range(0, len(students.group)):
	print "students.group[%d]" % i
	print "name -- {0}".format(students.group[i].name == student_object_array[i].name)
	print "sid -- {0}".format(students.group[i].sid == student_object_array[i].sid)
	print "absences -- {0}".format(students.group[i].absences == int(student_object_array[i].absences))
	print "tdy -- {0}".format(students.group[i].tdy == int(student_object_array[i].tdy))
	print "present -- {0}".format(students.group[i].present == int(student_object_array[i].present))
	print "enrolled -- {0}".format(students.group[i].enrolled == int(student_object_array[i].enrolled))
	print "school_year -- {0}".format(students.group[i].school_year == student_object_array[i].school_year)

print "\nTest Student.itterate()...\n"

incremental = 5
old_enrolled = student_test_one.enrolled
old_absences = student_test_one.absences
old_tdy = student_test_one.tdy
old_present = student_test_one.present

student_test_one.itterate(incremental)
print "increment +1 week, not selected"
print "object.week == 2 ? {0}".format(student_test_one.week == 2)
print "object.enrolled == {0} ? {1}".format(old_enrolled+incremental, student_test_one.enrolled == old_enrolled+incremental)
print "object.absences == {0} ? {1}".format(old_absences, student_test_one.absences == old_absences)
print "object.tdy == {0} ? {1}".format(old_tdy, student_test_one.tdy == old_tdy)
print "object.present == {0} ? {1}\n".format(old_present, student_test_one.present == old_present)


student_test_one.itterate(incremental, True)
print "increment +1 week, selected"
print "object.week == 3 ? {0}".format(student_test_one.week == 3)
print "object.enrolled == {0} ? {1}".format(old_enrolled+(incremental*2), student_test_one.enrolled == old_enrolled+(incremental*2))
print "object.absences >= {0} ? {1}".format(old_absences, student_test_one.absences >= old_absences)
print "object.tdy >= {0} ? {1}".format(old_tdy, student_test_one.tdy >= old_tdy)
print "object.present >= {0} ? {1}\n".format(old_present, student_test_one.present >= old_present)

print "\nCFA Data Genearator Test Suite -- END"
print "*****\n"