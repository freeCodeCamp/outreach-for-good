const initialState = {
  cfa : [],
  non : []
};

export default function viewReducer(state = initialState, action) {
  switch (action.type) {
  case 'DATA_VISUALIZATION_SUCCESS':
    let visualization = {};
    for(let key in action.visualization) {
      visualization[key] = [];
      for(let name in action.visualization[key]) {
        visualization[key].push({name, value: action.visualization[key][name]});
      }
    }
    return visualization;
  default:
    return state;
  }
}
