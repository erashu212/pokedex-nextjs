"use client";
import * as React from "react";
import { ListView } from "@pokedex/pokedex";
import { fetchPokemon } from "./data/slices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./data/store";
import { Container, LinearProgress } from "@pokedex/components";
import { useRouter } from "next/navigation";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.pokemon);
  const router = useRouter();
  const [pageConfig, setPageConfig] = React.useState({
    offset: 0,
    limit: 10,
  });
  const handlePaginationChange = React.useCallback(
    ({ page, pageSize }: { page: number; pageSize: number }) => {
      const offset = (page - 1) * pageSize;
      const limit = pageSize;
      setPageConfig({ offset, limit });
      dispatch(
        fetchPokemon({ offset: pageConfig.offset, limit: pageConfig.limit })
      );
    },
    [dispatch, pageConfig.limit, pageConfig.offset]
  );

  const handlePokemonSelection = React.useCallback(
    (payload: any) => {
      const { id } = payload as unknown as { id: string };
      router.push(`/${id}`);
    },
    [router]
  );

  React.useEffect(() => {
    dispatch(
      fetchPokemon({ offset: pageConfig.offset, limit: pageConfig.limit })
    );
  }, [dispatch, pageConfig.limit, pageConfig.offset]);

  return (
    <Container maxWidth="sm">
      <ListView
        columns={[
          {
            field: "name",
            headerName: "name",
          },
        ]}
        getRowId={(row) => row.name}
        rowCount={state.data.count ?? 0}
        rows={state.data.results ?? []}
        paginationMode="server"
        slots={{
          loadingOverlay: LinearProgress,
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: pageConfig.limit } },
        }}
        loading={state.loading}
        onPaginationModelChange={handlePaginationChange}
        onRowClick={handlePokemonSelection}
      />
    </Container>
  );
};

export default Home;
