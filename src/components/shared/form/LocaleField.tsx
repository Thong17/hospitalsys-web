import { languages } from 'contexts/language/constant'
import { Section } from '../Section'
import { DetailField, TextField } from '.'
import { useEffect, useState } from 'react'

export const LocaleField = ({
  name,
  onChange,
  describe,
  defaultValue,
  err,
  ...prop
}: any) => {
  const [localeField, setLocaleField] = useState(defaultValue || {})
  const langs = Object.keys(languages)

  useEffect(() => {
    setLocaleField(defaultValue)
  }, [defaultValue])

  const handleChange = (event) => {
    const props = event.target.name.split('.')
    const value = event.target.value

    const newCategory = {
      ...localeField,
      [props[1]]: value,
    }

    setLocaleField(newCategory)
    return onChange(newCategory)
  }

  return (
    <>
      {langs.length > 1 ? (
        <Section describe={describe} style={{ marginBottom: 20, marginTop: 20 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
              gridColumnGap: 20,
            }}
          >
            {langs.map((language, index) => {
              return (
                <TextField
                  err={err?.[language]?.message}
                  onChange={handleChange}
                  key={index}
                  type='text'
                  label={language}
                  name={`${name}.${language}`}
                  value={localeField?.[language] || ''}
                  {...prop}
                />
              )
            })}
          </div>
        </Section>
      ) : (
        <TextField
          err={err?.[langs[0]]?.message}
          onChange={handleChange}
          type='text'
          label={describe}
          name={`${name}.${langs[0]}`}
          value={localeField?.[langs[0]] || ''}
          {...prop}
        />
      )}
    </>
  )
}

export const LocaleDetail = ({
  name,
  onChange,
  describe,
  defaultValue,
  err,
  ...prop
}: any) => {
  const [localeField, setLocaleField] = useState(defaultValue || {})
  const langs = Object.keys(languages)

  const handleChange = (event) => {
    const props = event.target.name.split('.')
    const value = event.target.value

    const newCategory = {
      ...localeField,
      [props[1]]: value,
    }

    setLocaleField(newCategory)
    return onChange(newCategory)
  }

  return (
    <>
      {langs.length > 1 ? (
        <Section describe={describe} style={{ marginTop: 20, marginBottom: 20 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gridColumnGap: 20,
            }}
          >
            {langs.map((language, index) => {
              return (
                <DetailField
                  err={err?.[language]?.message}
                  onChange={handleChange}
                  key={index}
                  type='text'
                  label={language}
                  name={`${name}.${language}`}
                  value={localeField[language] || ''}
                  style={{ height: 39 }}
                  {...prop}
                />
              )
            })}
          </div>
        </Section>
      ) : (
        <DetailField
          err={err?.[langs[0]]?.message}
          onChange={handleChange}
          type='text'
          label={describe}
          name={`${name}.${langs[0]}`}
          value={localeField[langs[0]] || ''}
          style={{ height: 39 }}
          {...prop}
        />
      )}
    </>
  )
}
