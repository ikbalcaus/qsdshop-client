import { useEffect, useState } from 'react'
import { FaCirclePlus } from 'react-icons/fa6'
import styles from './APBrands.module.css'
import { LuPenLine, LuTrash } from 'react-icons/lu'
import APAddEditModal from '../APAddEditModal/APAddEditModal'
import APDeleteModal from '../APDeleteModal/APDeleteModal'
import { addBrand, editBrand, getBrands, deleteBrand } from '../../../services/brands'

export default function APBrands() {
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [data, setData] = useState([]);
  const [operation, setOperation] = useState("");
  const [tempId, setTempId] = useState(0);
  const [tempValue, setTempValue] = useState("");
  const fetchData = async () => setData(await getBrands());
  const [error, setError] = useState(null);

  useEffect(() => {
    try { fetchData() }
    catch (err: any) { setError(err) }
  }, []);

  async function formSubmit(inputValue: string) {
    if (operation === "add") {
      try { await addBrand({ name: inputValue }) }
      catch (err: any) { setError(err) }
    }
    else if (operation === "edit") {
      try { await editBrand({ id: tempId, name: inputValue }) }
      catch (err: any) { setError(err) }
    }
    else {
      try { await deleteBrand(tempId) }
      catch (err: any) { setError(err) }
    }
    fetchData();
  }

  function formatDate(date: string) {
    const d = new Date(date);
    return `${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}.${(d.getMonth() < 9) ? `0${d.getMonth() + 1}` : d.getMonth() + 1}.${d.getFullYear()} ${d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()}`;
  }

  return (
    <>
      <div className={styles.addButton} onClick={() => { setShowAddEditModal(true); setOperation("add") }}>
        <FaCirclePlus />
        <div className={styles.buttonText}>Add new brand</div>
      </div>
      <div className={styles.table}>
        <div className={styles.row} style={{ fontWeight: "700" }}>
          <div className={styles.cellId}>ID</div>
          <div className={styles.cell} style={{ marginLeft: "40px" }}>Name</div>
          <div className={styles.cell} style={{ marginLeft: "-40px" }}>Created at</div>
          <div className={styles.cell}>Options</div>
        </div>
        {data.map((item: any) => (
          <div className={styles.row}>
          <div className={styles.cellId}>{item.id}</div>
          <div className={styles.cell} style={{ marginLeft: "40px" }}>{item.name}</div>
          <div className={styles.cell} style={{ marginLeft: "-40px" }}>{formatDate(item.created_at)}</div>
          <div className={`${styles.cell} ${styles.cellButtons}`}>
            <div className={styles.actionButton} style={{ backgroundColor: "green" }} onClick={() => { setShowAddEditModal(true); setOperation("edit"); setTempId(item.id); setTempValue(item.name) }}>
              <div className={styles.buttonIcon} style={{ color: "green" }}><LuPenLine /></div>
              <div className={styles.buttonText}>Edit</div>
            </div>
            <div className={styles.actionButton} style={{ backgroundColor: "red" }} onClick={() => { setShowDeleteModal(true); setOperation("delete"); setTempId(item.id) }}>
              <div className={styles.buttonIcon} style={{ color: "red" }}><LuTrash /></div>
              <div className={styles.buttonText}>Delete</div>
            </div>
          </div>
        </div>
        ))}
      </div>
      {(showAddEditModal || showDeleteModal) && <div className={styles.blockContent}></div>}
      {showAddEditModal && <APAddEditModal value={tempValue} operation={operation} formSubmit={formSubmit} setShowModal={setShowAddEditModal} />}
      {showDeleteModal && <APDeleteModal formSubmit={formSubmit} setShowModal={setShowDeleteModal} />}
    </>
  )
}
