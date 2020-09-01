import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category } from '../category-interface';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  category: Category = {
    name: '',
    created_at: new Date(),
    updated_at: new Date(),
  };

  @Output() createdNewProduct = new EventEmitter();

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {}

  createCategory() {
    this.categoryService.create(this.category).subscribe(() => {
      this.categoryService.showMessage(
        `A categoria ${this.category.name} foi criada com sucesso`
      );
    });
    this.createdNewProduct.emit(true);
  }
}
