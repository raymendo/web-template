import _ from "lodash";
import {API_URL} from './config'

export function sortTable(table) {
    let dir = 'desc';
    const dirMap = {
        'asc': 'ascending',
        'desc': 'descending'
    };
    return function sort(n) {
        let sortedRows;
      
        dir = dir === 'desc' ? 'asc' : 'desc';
        sortedRows = _.orderBy(
          table.tBodies[0].rows,
          function (row) {
            const elm = row.getElementsByTagName("TD")[n];
            return elm.innerHTML.toLowerCase();
          },
          [dir]
        );
        table.tBodies[0].replaceChildren(...sortedRows);
        return dirMap[dir];
    }
}

export function searchTable(input, table, n) {
  let filter, tr, td, i, txtValue;
  if (!table) return
  filter = input.value.toUpperCase();
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[n];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

export function asyncForEach(collection, cb, i = 0) {
    setTimeout(() => {
      if (i >= collection.length) return

      cb(collection[i])
      
      asyncForEach(collection, cb, i + 1)
    }, 0)
}

export async function fetcher(url) {
  let data = Promise.resolve([])

  try {
    data = await fetch(API_URL + url)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not OK')
      }
      return res.json()
    })
  } catch (error) {
    return Promise.reject(error)
  }
  return data
}
