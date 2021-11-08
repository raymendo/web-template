import { useEffect, useRef, useReducer, useCallback } from 'react';

export function useDidMount() {
  const didMount = useRef(true)

  useEffect(() => {
    didMount.current = true
    return () => didMount.current = false
  })

  return {
    get current() {
      return didMount.current
    },
    get isMounted() {
      return didMount.current
    }
  }
}

// TODO: test bad deps on useCallBack
export function useSafeAsync({ asyncFunc, initialData }) {
  const [states, setStates] = useReducer(
    (state = {}, action = {}) => {
      return { ...state, ...action }
    }, { loading: false, data: initialData, error: null });

  const didMount = useDidMount()
  const isMounted = didMount.isMounted;
  const { data, error, loading } = states

  const execute = useCallback((...params) => {
    let result;

    if (typeof asyncFunc === 'function') {
      result = asyncFunc(...params)
      if (result?.constructor.name === 'Promise') {
        setStates({ loading: true })
        return result
          .then(res => {
            if (!isMounted) return null
            setStates({
              data: res,
              error: null,
              loading: false
            })
            return res
          })
          .catch(err => {
            if (!isMounted) return null
            setStates({ error: err, loading: false })
            // throw err
          })
      } else {
        void (result && setStates({ data: result }))
        // setData(result ?? data)
      }
    }
  }, [asyncFunc, isMounted])

  return [
    execute,
    data,
    loading,
    error,
    didMount
  ]
}
