<template>
  <div class="q-pa-md">
    <q-btn
      square
      color="primary"
      icon="settings"
      class="mb-2"
      @click="icon = true"
    />
    <q-table
      title="Treats"
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="id"
      selection="single"
      v-table-resizable
      separator="vertical"
      :visible-columns="visibleColumns"
      :pagination="{
        descending: pagination.descending,
        page: pagination.page,
        rowsPerPage: pagination.rowsPerPage,
        sortBy: pagination.sortBy || '',
      }"
      @update:pagination="handleUpdatePagination"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th></q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-italic text-blue"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr
          :props="props"
          :class="selection.includes(props.key) ? 'bg-gray-100' : ''"
          @click="onRowClick(props.row)"
        >
          <q-td
            ><q-checkbox
              v-model="selection"
              :val="props.row.id"
              label=""
              color=""
          /></q-td>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="text" :props="props">
            <q-badge color="green">
              {{ props.row.text }}
            </q-badge>
          </q-td>
          <q-td key="author" :props="props">
            <q-badge color="blue" v-if="props.row.author">
              {{ props.row.author }}
            </q-badge>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:pagination="scope">
        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="first_page"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.firstPage"
        />

        <q-btn
          icon="chevron_left"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.prevPage"
        />

        <q-btn
          icon="chevron_right"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.nextPage"
        />

        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="last_page"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.lastPage"
        />
      </template>
    </q-table>
    <q-dialog v-model="icon">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Options</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="q-gutter-sm">
            <q-checkbox v-model="visibleColumns" val="id" label="ID" />
            <q-checkbox v-model="visibleColumns" val="text" label="Quote" />
            <q-checkbox v-model="visibleColumns" val="author" label="Author" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { QTableProps } from 'quasar';
import axios from 'axios';

interface Row {
  id: string;
  text: string;
  author: string;
}

const icon = ref(false);
const selection = ref<string[]>([]);
const uriAPI = 'https://636322ac66f75177ea3e0792.mockapi.io/quote';
const visibleColumns = ref(['id', 'text', 'author']);
const rows = ref<Row[]>([]);
const pagination = ref({
  sortBy: null,
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

const columns: QTableProps['columns'] = [
  {
    name: 'id',
    label: 'id',
    align: 'left',
    field: 'id',
  },
  {
    name: 'text',
    align: 'left',
    label: 'Quote',
    field: 'text',
    style: 'max-width: 200px',
  },
  {
    name: 'author',
    align: 'left',
    label: 'Author',
    field: 'author',
    style: 'width: 50px',
  },
];

onMounted(async () => {
  const { data } = await axios.get(uriAPI);
  if (Array.isArray(data)) {
    rows.value = data;
  }
});

const handleUpdatePagination = (value: any) => {
  pagination.value = value;
};

const onRowClick = (row: Row) => {
  const index = selection.value.findIndex((item) => item === row.id);
  if (index === -1) {
    selection.value = [...selection.value, row.id];
  } else {
    selection.value = selection.value.filter(
      (item) => item !== selection.value[index]
    );
  }
};
</script>
