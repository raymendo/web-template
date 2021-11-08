import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSafeAsync } from '../hooks';
const props = {}

export default function DataCard({ url, label, fetcher }) {
  const [
    safeFetcher,
    data,
    loading,
    error
  ] = useSafeAsync(
    {
      asyncFunc: fetcher,
      initialData: 0
    }
  )
  let result = isNaN(+data) ? 0 : data

  useEffect(() => {
    safeFetcher(url)
  }, [safeFetcher, url])

  if (error || isNaN(+data)) {
    props['aria-errormessage'] = 'error'
  }

  return (
    <div aria-busy={loading} {...props}>
      <dt>{label}</dt>
      <dd>{result}</dd>
    </div>
  )
}

DataCard.propTypes = {
  url: PropTypes.string.isRequired, // path-like
  label: PropTypes.string.isRequired,
  fetcher: PropTypes.func.isRequired
}
