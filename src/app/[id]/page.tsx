"use client";
import * as React from "react";
import { DetailView, DetailViewProps } from "@pokedex/pokedex";
import { fetchPokemonById } from "../data/slices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../data/store";
import { Container, LinearProgress } from "@pokedex/components";

const Detail = ({ params }: { params: { id: string } }) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.selectedPokemon);
  const loading = state.loading;
  const props = state.data as unknown as DetailViewProps;

  React.useEffect(() => {
    dispatch(fetchPokemonById({ name: params.id }));
  }, [dispatch, params.id]);

  return (
    <Container maxWidth="lg">
      {loading || !props?.id ? <LinearProgress /> : <DetailView {...props} />}
    </Container>
  );
};

export default Detail;
