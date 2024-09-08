import React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import ButtonLink from '@/components/ButtonLink';
import CartIcon from '@/components/icons/CartIcon';
import { useContext } from 'react';
import { CartContext } from '@/components/CartContext';
import Center from './Center';

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;
const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
`;
const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  img {
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }
  div:nth-child(1) {
    order: 2;
  }
  @media screen and (min-width: 1000px) {
    grid-template-columns: 1.1fr 0.9fr;
    div:nth-child(1) {
      order: 0;
    }
    img {
      max-width: 100%;
    }
  }
`;
const Column = styled.div`
  display: flex;
  align-items: center;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

export default function Featured({ product }) {
  const { addProduct } = useContext(CartContext);

  function addFeaturedToCart() {
    addProduct(product._id);
  }

  // Check if product is null before rendering the component
  if (!product) {
    return null; // Or you can return a loading indicator or a message
  }

  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>{product.title}</Title>
              <Desc>{product.description}</Desc>
              <Title>Yash</Title>
              <Desc>I am the guy from India</Desc>
              <ButtonsWrapper>
                <ButtonLink href={'/product/' + product._id} outline={1} white={1}>
                  Read more
                </ButtonLink>
                <Button white onClick={addFeaturedToCart}>
                  <CartIcon />
                  Add to cart
                </Button>
              </ButtonsWrapper>
             
            </div>
          </Column>
          <Column>
            <img src="https://cdn.shopify.com/s/files/1/0452/2537/7959/files/IMG_1524_large.heic?v=1695984849" alt="" />
          </Column>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
