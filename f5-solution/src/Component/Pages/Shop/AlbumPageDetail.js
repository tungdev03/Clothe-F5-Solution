import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { albums } from './AlbumPage'; // Import albums data

import CustomHeader from '../../Layouts/Header/Header'; // Import header
import './AlbumPageDetail.css'; // Import CSS file

const AlbumDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Dùng để điều hướng
    const album = albums.find(album => album.id === parseInt(id));
    const imgRef = useRef(null);
    const zoomRef = useRef(null);

    

    // State để lưu màu sắc và size người dùng đã chọn
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    // State để hiển thị form
    // const [showForm, setShowForm] = useState(false);

    // State để lưu ảnh chính và ảnh phụ
    const [mainImage, setMainImage] = useState(album.imgSrc); // Hình ảnh chính ban đầu
    const [subImages] = useState([album.imgSrc, album.imgSrc1, album.imgSrc2]); // Các hình ảnh phụ

    // State để lưu số lượng sản phẩm
    const [quantity, setQuantity] = useState(1);

    // Tăng số lượng
    const incrementQuantity = () => {
        setQuantity(prevQuantity => Math.min(prevQuantity + 1, 99)); // Giới hạn tối đa 99
    };

    // Giảm số lượng
    const decrementQuantity = () => {
        setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1)); // Giới hạn tối thiểu 1
    };

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            alert("Vui lòng chọn màu sắc và size trước khi thêm vào giỏ hàng.");
            return;
        }
        // Lưu sản phẩm vào localStorage cùng với màu sắc, size, và số lượng
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.push({ ...album, selectedColor, selectedSize, quantity }); // Thêm số lượng
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Lưu lại trong localStorage
        // Điều hướng tới trang giỏ hàng
        navigate('/cart');
    };

    const handleBuyNow = () => {
        if (!selectedColor || !selectedSize) {
            alert("Vui lòng chọn màu sắc và size trước khi mua.");
            return;
        }
        // Hiện form mua hàng khi nhấn "Mua ngay"
        // setShowForm(true);
    };

    // Đóng form khi click ra ngoài
    // const handleCloseForm = (e) => {
    //     if (e.target.className === 'overlay') {
    //         setShowForm(false); // Ẩn form
    //     }
    // };

    // Hàm đổi ảnh chính với ảnh phụ khi click
    const handleImageClick = (clickedImage) => {
        setMainImage(clickedImage); // Đặt ảnh được click làm ảnh chính
    };

    const handleMouseMove = (e) => {
        const img = imgRef.current;
        const zoomLens = zoomRef.current;
        const { left, top, width, height } = img.getBoundingClientRect();
        const x = e.pageX - left;
        const y = e.pageY - top;
        const lensSize = 150;

        if (x < 0 || y < 0 || x > width || y > height) {
            zoomLens.style.display = 'none';
            return;
        }

        zoomLens.style.display = 'block';
        zoomLens.style.left = `${x - lensSize / 2}px`;
        zoomLens.style.top = `${y - lensSize / 2}px`;

        const zoomX = (x / width) * 100;
        const zoomY = (y / height) * 100;

        zoomLens.style.backgroundImage = `url(${mainImage})`;
        zoomLens.style.backgroundPosition = `${zoomX}% ${zoomY}%`;
        zoomLens.style.backgroundSize = `${width * 2}px ${height * 2}px`;
    };

    const handleMouseEnter = () => {
        const zoomLens = zoomRef.current;
        zoomLens.style.display = 'block';
    };

    const handleMouseLeave = () => {
        const zoomLens = zoomRef.current;
        zoomLens.style.display = 'none';
    };

    if (!album) {
        return <div>Album không tồn tại!</div>;
    }

    return (
        <div>
            <CustomHeader />
            <div className="album-detail-container">
                <div className="album-detail-content">
                    <div className="album-detail-images">
                        <div className="album-detail-sub-images">
                            {subImages.map((imgSrc, index) => (
                                <img
                                    key={index}
                                    src={imgSrc}
                                    alt={album.title}
                                    onClick={() => handleImageClick(imgSrc)} // Đổi ảnh chính khi click
                                    className={`album-sub-image ${imgSrc === mainImage ? 'selected' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                        <div
                            className="album-detail-main-image-container"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onMouseMove={handleMouseMove}
                        >
                            <div ref={zoomRef} className="zoom-lens"></div>
                            <img
                                src={mainImage}
                                alt={album.title}
                                className="album-detail-main-image"
                                ref={imgRef}
                            />
                        </div>
                    </div>

                    <div className="album-detail-info">
                        <h2>{album.title}</h2>
                        <p className="album-detail-product-code">Mã sản phẩm: 07682141244370401</p>
                        <p className="album-detail-price">Giá: {album.price}</p>
                        <p className="album-detail-material">Chất liệu: Vải tổng hợp cao cấp</p>

                        <div className="album-detail-colors">
                            <label>Màu sắc:</label>
                            <div className="album-detail-color-options">
                                {album.colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className={`color-circle ${selectedColor === color ? 'selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(color)}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        <div className="album-detail-sizes">
                            <label>Size:</label>
                            <div className="album-detail-size-options">
                                {['S', 'M', 'L'].map(size => (
                                    <button
                                        key={size}
                                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="album-detail-quantity-section">
                            <label className="quantity-label">Số lượng:</label>
                            <div className="album-detail-quantity">
                                <button
                                    onClick={decrementQuantity}
                                    className={`quantity-btn ${quantity === 1 ? 'disabled' : ''}`}
                                    disabled={quantity === 1}
                                >
                                    <i className="material-icons">-</i> {/* Icon trừ */}
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button onClick={incrementQuantity} className="quantity-btn">
                                    <i className="material-icons">+</i> {/* Icon cộng */}
                                </button>
                            </div>
                        </div>



                        <div className="album-detail-actions">
                            <button className="add-to-cart-btn" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                            <button className="buy-now-btn" onClick={handleBuyNow}>Mua ngay</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumDetail;
