import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Spinner from "@/components/Spinner";
import { prettyDate } from "@/lib/date";

function AdminsPage({ swal }) {
  const [email, setEmail] = useState('');
  const [adminEmails, setAdminEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función para agregar un nuevo administrador
  const addAdmin = (ev) => {
    ev.preventDefault();
    axios.post('/api/admins', { email })
      .then(res => {
        swal.fire({
          title: 'Admin creado!',
          icon: 'success',
        });
        setEmail('');
        loadAdmins();
      })
      .catch(err => {
        swal.fire({
          title: 'Error!',
          text: err.response?.data?.message || 'Error al agregar el administrador',
          icon: 'error',
        });
      });
  };

  // Función para eliminar un administrador
  const deleteAdmin = (_id, email) => {
    swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar al administrador ${email}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, bórralo!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/admins?_id=${_id}`)
          .then(() => {
            swal.fire({
              title: 'Admin borrado!',
              icon: 'success',
            });
            loadAdmins();
          })
          .catch(err => {
            swal.fire({
              title: 'Error!',
              text: 'Error al eliminar el administrador',
              icon: 'error',
            });
          });
      }
    });
  };

  // Función para cargar la lista de administradores
  const loadAdmins = () => {
    setIsLoading(true);
    axios.get('/api/admins')
      .then(res => {
        setAdminEmails(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        swal.fire({
          title: 'Error!',
          text: 'Error al cargar los administradores',
          icon: 'error',
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  return (
    <Layout>
      <h1>Administradores</h1>
      <h2>Agregar nuevo administrador</h2>
      <form onSubmit={addAdmin}>
        <div className="flex gap-2">
          <input
            type="email"
            className="mb-0"
            value={email}
            onChange={ev => setEmail(ev.target.value)}
            placeholder="Correo electrónico de Google"
            required
          />
          <button
            type="submit"
            className="btn-primary py-1 whitespace-nowrap">
            Agregar administrador
          </button>
        </div>
      </form>

      <h2>Administradores existentes</h2>
      <table className="basic">
        <thead>
          <tr>
            <th className="text-left">Correo electrónico del admin</th>
            <th>Fecha de creación</th>
            <th>Acciones</th>
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
          {adminEmails.length > 0 && adminEmails.map(adminEmail => (
            <tr key={adminEmail._id}>
              <td>{adminEmail.email}</td>
              <td>
                {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
              </td>
              <td>
                <button
                  onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)}
                  className="btn-red">
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }) => (
  <AdminsPage swal={swal} />
));
