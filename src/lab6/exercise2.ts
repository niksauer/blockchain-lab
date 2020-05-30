import axios from 'axios';

export async function exercise2(): Promise<void> {
  const instance = axios.create({
    baseURL: 'http://drupal8.docksal/jsonapi'
  });

  const response = await instance.get('/node/ingredient');
  const ingredients = response.data['data'].map((ingredientNode: any) => {
    const attributes = ingredientNode['attributes'];

    return {
      name: attributes['title'],
      description: attributes['body']['processed'],
      price: attributes['field_ingredient_price']
    };
  });

  console.log(ingredients);
}
