export default {
  session : {
    token : null,
    me    : {
      id    : null,
      name  : null,
      email : null,
      image : null,
      role  : null
    }
  },
  view : {
    sidebar : {
      expand  : false,
      popover : false
    }
  },
  records : {
    current : [],
    list    : []
  },
  student : {
    student       : {},
    records       : [],
    interventions : [],
    outreaches    : [],
    notes         : []
  }
};
