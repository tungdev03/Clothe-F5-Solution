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
    const [showForm, setShowForm] = useState(false);

    // State để lưu ảnh chính và ảnh phụ
    const [mainImage, setMainImage] = useState(album.imgSrc); // Hình ảnh chính ban đầu
    const [subImages] = useState([album.imgSrc, album.imgSrc1, album.imgSrc2]); // Các hình ảnh phụ

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            alert("Vui lòng chọn màu sắc và size trước khi thêm vào giỏ hàng.");
            return;
        }
        // Lưu sản phẩm vào localStorage cùng với màu sắc và size
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.push({ ...album, selectedColor, selectedSize }); // Thêm sản phẩm vào giỏ hàng
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
        setShowForm(true);
    };

    // Đóng form khi click ra ngoài
    const handleCloseForm = (e) => {
        if (e.target.className === 'overlay') {
            setShowForm(false); // Ẩn form
        }
    };

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

                        <div className="album-detail-actions">
                            <button className="add-to-cart-btn" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                            <button className="buy-now-btn" onClick={handleBuyNow}>Mua ngay</button>
                        </div>
                    </div>
                </div>

                {/* Phần giới thiệu sản phẩm ở dưới ảnh chính */}
                <div className="album-detail-introduction">
                    <h3>Giới thiệu sản phẩm</h3>
                    <p>
                        Sản phẩm {album.title} được thiết kế với chất liệu vải tổng hợp cao cấp, mang lại sự thoải mái và phong cách sang trọng.
                        Với thiết kế tinh tế và màu sắc hiện đại, chiếc đầm này hoàn hảo cho những bữa tiệc hoặc sự kiện quan trọng.
                    </p>
                    <p>
                        Được chế tác tỉ mỉ và kỹ lưỡng, sản phẩm không chỉ nổi bật về mặt thẩm mỹ mà còn mang đến sự thoải mái tối đa khi mặc.
                        Đây chắc chắn là một sự lựa chọn lý tưởng cho các quý cô muốn nổi bật và tự tin hơn.
                    </p>
                </div>
            </div>

            {/* Hiển thị form khi nhấn "Mua ngay" */}
            {showForm && (
                <div className="overlay" onClick={handleCloseForm}>
                    <div className="buy-now-form">
                        <h2>Thông tin mua hàng</h2>
                        <div className="buy-now-product-info">
                            <img src={mainImage} alt={album.title} className="buy-now-image" />
                            <div className="buy-now-details">
                                <p>Sản phẩm: {album.title}</p>
                                <p className="price">Giá: {album.price}</p>
                                <p>Màu sắc: {selectedColor}</p>
                                <p>Size: {selectedSize}</p>
                            </div>
                        </div>
                        <form>
                            <label>
                                Tên khách hàng:
                                <input type="text" name="name" required />
                            </label>
                            <label>
                                Địa chỉ giao hàng:
                                <input type="text" name="address" required />
                            </label>
                            <label>
                                Số điện thoại:
                                <input type="text" name="phone" required />
                            </label>
                            <button type="submit">Xác nhận mua</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlbumDetail;
