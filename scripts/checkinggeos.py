#!/usr/bin/env python


from django.contrib.gis.geos.libgeos import lib_path, geos_version_info


print u'----------------------------------------------------------------------'
print u' Checking GEOS'
print u' - lib_path: %s' % lib_path
print u' - geos_version_info: %s' % geos_version_info()
print u'----------------------------------------------------------------------'
