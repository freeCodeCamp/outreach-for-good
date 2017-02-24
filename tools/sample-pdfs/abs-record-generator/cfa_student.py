import csv
import datetime
from random import randint

class Student():
    """
    STUDENT OBJECT

    Stores absence record proprerties for a specific student.
    Iterations of record can be created by calling Student.itterate(inc).
    """
    # refactor to accept row of csv data
    def __init__(self, name, sid, grade, absences, tdy, present, enrolled, school_year):
        self.name = name
        self.sid = sid
        self.grade = grade
        self.absences = int(absences)
        self.tdy = int(tdy)
        self.present = int(present)
        self.enrolled = int(enrolled)
        self.school_year = school_year
        self.week = 1

    def itterate(self, incremental, selected=False):
        # Add statement if incremental == 0,
        # only increment enrolled and week
        # also, incremental can't be between 0-4
        if incremental <= 4:
            print "Incremental can't be less than or equal to 4"
        else:
            self.week += 1
            self.enrolled += int(incremental)
            if selected == True:
                """
                If selected, will incriment abs, tdy, and present
                toggled for a record in sequence greater than
                first absence record of series.
                """
                self.absences += randint(0, int(incremental))
                self.tdy += randint(0, int(incremental))
                self.present = self.enrolled - self.absences

# Not utilized in script yet...
#   could be more DRY?
class StudentsGroup():
    """
    STUDENT GROUP OBJECT

    Stores an array of student objects. Func generate csv files.
    Todo: add self.headers in constructor, utilize within group.
    """
    def __init__(self, student_array, headers):
        self.group = student_array
        self.headers = headers

    def createOne(self, verbose):
        filepath = self.__create_filepath()
        with open(filepath, 'a') as outcsv:
            writer = csv.writer(outcsv,
                delimiter=',',
                quotechar='"',
                quoting=csv.QUOTE_MINIMAL,
                lineterminator='\n')
            for i in range(0, len(self.group)):
                self.__write_a_record(writer, i)
        if verbose == True:
            print  self.__print_file_destination(filepath)

    def createMultiple(self, weeks, inc, verbose):
        for week in range(0, weeks):
            # if first week of multiple recs, generate filepath w/o week indx
            filepath = self.__create_filepath(week)
            if week > 0:
            # otherwise, generate filepath w/ week indx
                indexes = self.__get_idxs(len(self.group))
                if verbose == True:
                    print "%d records in..." % len(indexes)

            with open(filepath, 'a') as outcsv:
                writer = csv.writer(outcsv,
                    delimiter=',',
                    quotechar='"',
                    quoting=csv.QUOTE_MINIMAL,
                    lineterminator='\n')
                for i in range(0, len(self.group)):
                    if week == 0:
                    # if first week, write record to csv row w/o filtering
                        self.__write_a_record(writer, i)
                    else:
                    # otherwise, write record to csv row w/
                    #   indexes filtering array
                        match = False
                        for idx in indexes:
                            if idx == i:
                                match = True
                                break
                        if match == False:
                            self.group[i].itterate(inc)
                        else:
                            self.group[i].itterate(inc, True)
                            self.__write_a_record(writer, i)

                if verbose == True:
                    print  self.__print_file_destination(filepath)

    # 'PRIVATE' FUNCTIONS
    def __write_a_record(self, w, idx):
        w.writerow([self.group[idx].name, self.group[idx].sid])
        w.writerow([self.headers[2] + ':', int(self.group[idx].grade)])
        w.writerow([self.headers[3] + ':', int(self.group[idx].absences)])
        w.writerow([self.headers[4] + ':', int(self.group[idx].tdy)])
        w.writerow([self.headers[5] + ':', int(self.group[idx].present)])
        w.writerow([self.headers[6] + ':', int(self.group[idx].enrolled)])
        w.writerow([self.headers[7] + ':', self.group[idx].school_year])

    def __print_file_destination(self, dest):
        return "\nNew file: %s\n" % dest

    def __get_idxs(self, max):
        idx_list = list()
        for n in range(0, randint(2, max)):
            rnd_idx = randint(0, max - 1)
            try:
                idx_list.index(rnd_idx)
            except ValueError:
                idx_list.append(rnd_idx)
        return idx_list

    def __create_filepath(self, idx=0):
        return "fcc-cfa-dataset-{0}-{1}.csv".format(str(datetime.date.today()), str(idx + 1))
