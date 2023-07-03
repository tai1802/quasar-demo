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
      v-model:selected="selected"
      :visible-columns="visibleColumns"
      :pagination="{
        rowsPerPage: 50,
      }"
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
const icon = ref(false);
const selected = ref([]);
const uriAPI = 'https://636322ac66f75177ea3e0792.mockapi.io/quote';
const visibleColumns = ref(['id', 'text', 'author']);
const rows = ref([]);

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
  },
  { name: 'author', align: 'left', label: 'Author', field: 'author' },
];

onMounted(async () => {
  const { data } = await axios.get(uriAPI);
  if (Array.isArray(data)) {
    rows.value = data;
  }
});
</script>
