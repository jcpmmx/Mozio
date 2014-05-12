DEBUG = True


DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.mysql',
        'NAME': 'mozio_test',
        'USER': 'mozio_test',
        'PASSWORD': 'mozio_test',
        'OPTIONS': {
            'init_command': 'SET storage_engine=MyISAM'
        }
    }
}
