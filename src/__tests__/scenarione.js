import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import {server} from '../../tests/server'
import App from '../app'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('user navigation and form filling', async () => {
  render(<App />) // replace App with your component

  // 1 - l'utilisateur est sur la Home
  expect(window.location.pathname).toBe('/')

  // 2 - Un titre "Welcome home" est dans le document
  expect(screen.getByText('Welcome home')).toBeInTheDocument()

  // 3 - Un lien "Fill out the form" est dans le document
  const formLink = screen.getByRole('link', {name: /Fill out the form/i})
  expect(formLink).toBeInTheDocument()

  // 4 - l'utilisateur clique sur le lien
  userEvent.click(formLink)

  // 5 - l'utilisateur est redirigé sur la page 1
  expect(window.location.pathname).toBe('/page-1')

  // 6 - Un titre "Page 1" est dans le document
  expect(screen.getByText('Page 1')).toBeInTheDocument()

  // 7 - un lien "Go home" est dans le document
  expect(screen.getByRole('link', {name: /Go Home/i})).toBeInTheDocument()

  // 8 - Un champ avec le label "Favorite Food" est dans le document
  const favoriteFoodInput = screen.getByLabelText('Favorite Food')
  expect(favoriteFoodInput).toBeInTheDocument()

  // 9 - l'utilisateur rempli le champ avec "Les pâtes"
  userEvent.type(favoriteFoodInput, 'Les pâtes')
  expect(favoriteFoodInput).toHaveValue('Les pâtes')

  // 10 - un lien "Next" est dans le document
  expect(screen.getByRole('link', {name: /Next/i})).toBeInTheDocument()

  // 11 - l'utilisateur clique sur le lien "Next"
  const nextLink = screen.getByRole('link', {name: /Next/i})
  userEvent.click(nextLink)

  // 12- l'utilisateur est redirigé sur la page 2
  expect(window.location.pathname).toBe('/page-2')

  // 13 - Un titre "Page 2" est dans le document
  expect(screen.getByText('Page 2')).toBeInTheDocument()

  // 14 - un lien "Go Back" est dans le document
  expect(screen.getByRole('link', {name: /Go Back/i})).toBeInTheDocument()

  // 15 - Un champ avec le label "Favorite drink" est dans le document
  const favoriteDrinkInput = screen.getByLabelText('Favorite Drink')
  expect(favoriteDrinkInput).toBeInTheDocument()

  // 16 - l'utilisateur rempli le champ avec "Bière"
  userEvent.type(favoriteDrinkInput, 'Bière')
  expect(favoriteDrinkInput).toHaveValue('Bière')

  // 17 - un lien "Review" est dans document
  const reviewLink = screen.getByRole('link', {name: /Review/i})
  expect(reviewLink).toBeInTheDocument()

  // 18 - l'utilisateur clique sur le lien "Review"
  userEvent.click(reviewLink)

  // 19 - l'utilisateur est redirigé sur la page de confirmation
  expect(window.location.pathname).toBe('/confirm')

  // 20 - Un titre "Confirm" est dans le document
  expect(
    screen.getByRole('heading', {level: 2, name: /Confirm/i}),
  ).toBeInTheDocument()

  // 21 - Un texte "Please confirm your choices" est dans le document
  expect(screen.getByText('Please confirm your choices')).toBeInTheDocument()

  // 22 - Un texte label "Favorite Food" a pour contenu "Les pâtes"
  expect(screen.getByLabelText(/food/i)).toHaveTextContent('Les pâtes')

  // 23 - Un texte label "Favorite Drink" a pour contenu "Bière"
  expect(screen.getByLabelText(/drink/i)).toHaveTextContent('Bière')

  // 24 - un lien "Go Back" est dans le document
  expect(screen.getByRole('link', {name: /Go Back/i})).toBeInTheDocument()

  // 25 - un bouton "Confirm" est dans le document
  const confirmButton = screen.getByRole('button', {name: /Confirm/i})
  expect(confirmButton).toBeInTheDocument()

  // 26 - l'utilisateur clique sur le bouton "Confirm"
  userEvent.click(confirmButton)

  // Wait for the form submission to complete
  await waitFor(() => expect(window.location.pathname).toBe('/success'))

  // 27 - l'utilisateur est redirigé sur la page de Félicitation
  expect(window.location.pathname).toBe('/success')

  // 28 - Un titre "Congrats. You did it." est dans le document
  await waitFor(() =>
    expect(screen.getByRole('heading')).toHaveTextContent(
      'Congrats. You did it.',
    ),
  )

  // 29 - un lien "Go home" est dans le document
  const goHomeLink = screen.getByRole('link', {name: /Go home/i})
  expect(goHomeLink).toBeInTheDocument()

  //30 - l'utilisateur clique sur le lien "Go home"
  userEvent.click(goHomeLink)

  // 31 - l'utilisateur est redirigé sur la home
  expect(window.location.pathname).toBe('/')

  // 32 - Un titre "Welcome home" est dans le document
  expect(
    screen.getByRole('heading', {level: 1, name: /Welcome home/i}),
  ).toBeInTheDocument()
})
