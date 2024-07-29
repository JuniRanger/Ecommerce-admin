import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {withSwal} from "react-sweetalert2";

function SettingsPage({swal}) {
  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeaturedProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetchAll().then(() => {
      setIsLoading(false);
    });
  }, []);

  async function fetchAll() {
    try {
      const productsRes = await axios.get('/api/products');
      setProducts(productsRes.data);

      const featuredProductRes = await axios.get('/api/settings?name=featuredProductId');
      setFeaturedProductId(featuredProductRes.data?.value || ''); // Valor por defecto

      const shippingFeeRes = await axios.get('/api/settings?name=shippingFee');
      setShippingFee(shippingFeeRes.data?.value || ''); // Valor por defecto
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }

  async function saveSettings() {
    setIsLoading(true);
    try {
      await axios.put('/api/settings', {
        name: 'featuredProductId',
        value: featuredProductId,
      });
      await axios.put('/api/settings', {
        name: 'shippingFee',
        value: shippingFee,
      });
      await swal.fire({
        title: 'Settings saved!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error al guardar la configuración', error);
      await swal.fire({
        title: 'Error al guardar la configuración',
        text: error.message,
        icon: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <h1>Ajustes</h1>
      {isLoading && (
        <Spinner />
      )}
      {!isLoading && (
        <>
          <label>Producto destacado</label>
          <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
            {products.length > 0 && products.map(product => (
              <option key={product._id} value={product._id}>{product.title}</option>
            ))}
          </select>
          <label>Precio de envío (en USD$)</label>
          <input type="number"
                 value={shippingFee}
                 onChange={ev => setShippingFee(ev.target.value)}
          />
          <div>
            <button onClick={saveSettings} className="btn-primary">Guardar Ajustes</button>
          </div>
        </>
      )}
    </Layout>
  );
}

export default withSwal(({swal}) => (
  <SettingsPage swal={swal} />
));
