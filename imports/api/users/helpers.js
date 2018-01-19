import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Courses } from '/imports/api/courses/courses';

Meteor.users.helpers({
  emailAddress() {
    return this.emails[0].address;
  },

  fullName() {
    const fullName =
      this.preferredName ||
      (this.services && this.services.google && this.services.google.name) ||
      (this.emailAddress().split('@')[0]);

    return fullName;
  },

  firstName() {
    const firstName =
      (this.services && this.services.google && this.services.google.given_name) ||
      this.fullName().split(' ')[0];

    return firstName;
  },

  initials() {
    let initials = '';
    const fullName = this.fullName();

    let parts = fullName.split(' ');
    if (parts.length < 2) parts = fullName.split('_');

    if (parts.length >= 2) {
      initials = parts[0][0] + parts[parts.length - 1][0];
    } else {
      initials = parts[0].substring(0, 2);
    }

    return initials.toUpperCase();
  },

  courses() {
    if (Roles.userIsInRole(this._id, ['admin', 'mta'])) {
      return Courses.find({ active: true }, { sort: { name: 1 } });
    }

    const htaCourseIds = Roles.getGroupsForUser(this._id, 'hta');
    const taCourseIds = Roles.getGroupsForUser(this._id, 'ta');
    return Courses.find(
      { _id: { $in: htaCourseIds.concat(taCourseIds) }, active: true },
      { sort: { name: 1 } },
    );
  },

  htaCourses() {
    const htaCourseIds = Roles.getGroupsForUser(this._id, 'hta');
    return Courses.find({ _id: { $in: htaCourseIds }, active: true });
  },

  isTAOrAbove() {
    return this.courses().count() > 0;
  },
});
