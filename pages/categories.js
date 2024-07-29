import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';
import Spinner from "@/components/Spinner";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    setIsLoading(true);
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
      setIsLoading(false);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map(p => ({
        name: p.name,
        values: p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(',')
      }))
    );
  }

  function deleteCategory(category) {
    swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres borrar ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, borrar!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete(`/api/categories?_id=${_id}`);
        fetchCategories();
      }
    });
  }

  function addProperty() {
    setProperties(prev => [
      ...prev, { name: '', values: '' }
    ]);
  }

  function handlePropertyNameChange(index, newName) {
    setProperties(prev => {
      const updatedProperties = [...prev];
      updatedProperties[index].name = newName;
      return updatedProperties;
    });
  }

  function handlePropertyValuesChange(index, newValues) {
    setProperties(prev => {
      const updatedProperties = [...prev];
      updatedProperties[index].values = newValues;
      return updatedProperties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties(prev => prev.filter((_, index) => index !== indexToRemove));
  }

  return (
    <Layout>
      <h1>Categorías</h1>
      <label>
        {editedCategory
          ? `Editar categoría ${editedCategory.name}`
          : 'Crear nueva categoría'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={'Nombre de categoría'}
            onChange={ev => setName(ev.target.value)}
            value={name}
            required
          />
          <select
            onChange={ev => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">Sin categoría principal</option>
            {categories.length > 0 && categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Propiedades</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Agregar nueva propiedad
          </button>
          {properties.length > 0 && properties.map((property, index) => (
            <div className="flex gap-1 mb-2" key={index}>
              <input
                type="text"
                value={property.name}
                className="mb-0"
                onChange={ev => handlePropertyNameChange(index, ev.target.value)}
                placeholder="Nombre de propiedad (ejemplo: color)"
              />
              <input
                type="text"
                className="mb-0"
                onChange={ev => handlePropertyValuesChange(index, ev.target.value)}
                value={property.values}
                placeholder="Valores, separados por comas"
              />
              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-red"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
              className="btn-default"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="btn-primary py-1"
          >
            Guardar
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Nombre de categoría</td>
              <td>Categoría principal</td>
              <td>Acciones</td>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={3}>
                  <div className="py-4">
                    <Spinner fullWidth={true} />
                  </div>
                </td>
              </tr>
            )}
            {categories.length > 0 && categories.map(category => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.parent?.name || 'N/A'}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-default mr-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="btn-red"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }) => (
  <Categories swal={swal} />
));
