import re

from django.contrib.auth.models import (AbstractBaseUser, PermissionsMixin,
                                        UserManager)
from django.core.mail import send_mail
from django.core import validators
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib import admin


class User(AbstractBaseUser, PermissionsMixin):
    """
    A custom user class that basically mirrors Django's `AbstractUser` class
    and doesn't force `first_name` or `last_name` with sensibilities for
    international names.
    http://www.w3.org/International/questions/qa-personal-names
    """
    username = models.CharField(_('username'), max_length=30, unique=True,
                                help_text=_('Required. 30 characters or fewer. Letters, numbers and '
                                            '@/./+/-/_ characters'),
                                validators=[
        validators.RegexValidator(re.compile(
            '^[\w.@+-]+$'), _('Enter a valid username.'), 'invalid')
    ])
    parent_name = models.CharField(_('full name'), max_length=254, blank=True)
    email = models.EmailField(_('email address'), max_length=254, unique=True)
    is_root = models.BooleanField(_('root status'), default=False,
                                   help_text=_('Designates whether the user can log into this admin '
                                               'site.'))
    is_admin = models.BooleanField(_('admin status'), default=False,
                                  help_text=_('Designates whether the user can approve other users '
                                              'site.'))
    is_manager = models.BooleanField(_('manager status'), default=False,
                                   help_text=_('Designates whether the user can create in the site '
                                               'site.'))
    is_staff = models.BooleanField(_('employee status'), default=False,
                                   help_text=_('Designates whether the user can view in the site '
                                               'site.'))
    is_approved = models.BooleanField(_('approved status'), default=False,
                                      help_text=_('Designates whether the user can view the data in the site '
                                                  'site.'))
    is_active = models.BooleanField(_('active'), default=True,
                                    help_text=_('Designates whether this user should be treated as '
                                                'active. Unselect this instead of deleting accounts.'))

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']


class CustomUserAdmin(admin.ModelAdmin):
    """
    The default UserAdmin class, but with changes for our CustomUser
    where `first_name` and `last_name` are replaced by `full_name` and
    `short_name`
    """
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('email',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_root', 'is_admin', 'is_staff', 'is_approved',   'is_manager', 'is_superuser',
                                       'groups', 'user_permissions')}),

    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2')}
         ),
    )

    list_display = ('username', 'email', 'is_root', 'is_admin',
                    'is_active', 'is_manager', 'is_staff', 'is_approved')
    list_filter = ('is_manager', 'is_admin', 'is_root', 'is_superuser',
                   'is_approved', 'is_staff', 'is_active', 'groups')
    search_fields = ('username', 'email')
    ordering = ('username',)
    filter_horizontal = ('groups', 'user_permissions',)

    pass
